import prisma from "../config/prisma.js";
import { findOrCreateInvoice } from "./invoiceService.js";
import { randomUUID } from "node:crypto";

interface CreateTransactionData {
  description: string;
  amount: number;
  date: Date;
  type: string;
  userId: string;
  categoryId?: string;
  paymentMethodId?: string;
  cardId?: string;
  installments?: number;
}

interface UpdateTransactionData {
  description: string;
  amount: number;
  date: Date;
  type: string;
  categoryId?: string;
  paymentMethodId?: string;
  cardId?: string;
}

function splitAmount(amount: number, installments: number): number[] {
  const totalCents = Math.round(amount * 100);
  const baseCents = Math.floor(totalCents / installments);
  const remainder = totalCents % installments;

  return Array.from({ length: installments }, (_, index) => {
    const cents =
      baseCents + (index < remainder ? 1 : 0);

    return cents / 100;
  });
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);

  result.setMonth(result.getMonth() + months);

  return result;
}

async function validatePayment(
  userId: string,
  paymentMethodId?: string,
  cardId?: string
) {
  if (!paymentMethodId) {
    if (cardId) {
      throw new Error(
        "O cartão só pode ser informado quando houver uma forma de pagamento."
      );
    }

    return;
  }

  const paymentMethod = await prisma.paymentMethod.findFirst({
    where: {
      id: paymentMethodId,
      userId,
    },
  });

  if (!paymentMethod) {
    throw new Error(
      "Forma de pagamento não encontrada."
    );
  }

  const paymentMethodName =
    paymentMethod.name.trim().toLowerCase();

  const requiresCard =
    paymentMethodName === "crédito" ||
    paymentMethodName === "debito" ||
    paymentMethodName === "débito";

  const doesNotAllowCard =
    paymentMethodName === "pix" ||
    paymentMethodName === "dinheiro";

  if (requiresCard && !cardId) {
    throw new Error(
      `A forma de pagamento "${paymentMethod.name}" exige um cartão.`
    );
  }

  if (doesNotAllowCard && cardId) {
    throw new Error(
      `A forma de pagamento "${paymentMethod.name}" não pode utilizar cartão.`
    );
  }

  if (cardId) {
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId,
      },
    });

    if (!card) {
      throw new Error("Cartão não encontrado.");
    }
  }
}

async function validateCreditLimit(
  cardId: string,
  userId: string,
  amount: number
) {
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      userId,
    },
  });

  if (!card) {
    throw new Error("Cartão não encontrado.");
  }

  if (card.creditLimit === null) {
    throw new Error(
      "O cartão não possui limite de crédito definido."
    );
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      cardId,
      status: {
        in: ["aberta", "fechada"],
      },
    },
    include: {
      transactions: true,
    },
  });

  let usedLimit = 0;

  for (const invoice of invoices) {
    for (const transaction of invoice.transactions) {
      if (transaction.type === "despesa") {
        usedLimit += Number(transaction.amount);
      }
    }
  }

  const creditLimit = Number(card.creditLimit);

  const availableLimit =
    creditLimit - usedLimit;

  if (amount > availableLimit) {
    throw new Error(
      `Limite de crédito insuficiente. Limite disponível: R$ ${availableLimit.toFixed(
        2
      )}.`
    );
  }
}

export async function createTransaction(
  data: CreateTransactionData
) {
  if (data.type === "receita") {
    if (data.cardId) {
      throw new Error(
        "Receitas não podem ser vinculadas a cartões."
      );
    }

    if (
      data.installments !== undefined &&
      data.installments > 1
    ) {
      throw new Error(
        "Receitas não podem ser parceladas."
      );
    }
  }
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId: data.userId,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    if (category.type !== data.type) {
      throw new Error(
        "O tipo da transação não corresponde ao tipo da categoria."
      );
    }
  }

  // =========================
  // VALIDAÇÃO DO PAGAMENTO
  // =========================

  await validatePayment(
    data.userId,
    data.paymentMethodId,
    data.cardId
  );

  // Receita não pode utilizar cartão
  if (data.type === "receita" && data.cardId) {
    throw new Error(
      "Receitas não podem ser vinculadas a cartões."
    );
  }

  // =========================
  // VALIDAÇÃO DAS PARCELAS
  // =========================

  const installments = data.installments ?? 1;

  if (
    !Number.isInteger(installments) ||
    installments < 1
  ) {
    throw new Error(
      "O número de parcelas deve ser um número inteiro maior que zero."
    );
  }

  // =========================
  // IDENTIFICA A FORMA DE PAGAMENTO
  // =========================

  let paymentMethodName = "";

  if (data.paymentMethodId) {
    const paymentMethod =
      await prisma.paymentMethod.findFirst({
        where: {
          id: data.paymentMethodId,
          userId: data.userId,
        },
      });

    if (!paymentMethod) {
      throw new Error(
        "Forma de pagamento não encontrada."
      );
    }

    paymentMethodName =
      paymentMethod.name.trim().toLowerCase();
  }

  const isCredit =
    paymentMethodName === "crédito";

  // =========================
  // PARCELAMENTO
  // =========================

  if (installments > 1 && !isCredit) {
    throw new Error(
      "O parcelamento está disponível apenas para compras no crédito."
    );
  }

  // =========================
  // TRANSAÇÃO NORMAL
  // OU CRÉDITO EM 1 PARCELA
  // =========================

  if (!isCredit || installments === 1) {
    let invoiceId: string | undefined;

    if (isCredit && data.cardId) {
      await validateCreditLimit(
        data.cardId,
        data.userId,
        data.amount
      );

      const invoice =
        await findOrCreateInvoice(
          data.cardId,
          data.userId,
          data.date
        );

      invoiceId = invoice.id;
    }

    return prisma.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type,
        userId: data.userId,

        ...(data.categoryId && {
          categoryId: data.categoryId,
        }),

        ...(data.paymentMethodId && {
          paymentMethodId: data.paymentMethodId,
        }),

        ...(data.cardId && {
          cardId: data.cardId,
        }),

        ...(invoiceId && {
          invoiceId,
        }),

        installmentNumber: 1,
        totalInstallments: 1,
      },
    });
  }

  // =========================
  // PARCELAMENTO NO CRÉDITO
  // =========================

  if (!data.cardId) {
    throw new Error(
      "O parcelamento no crédito exige um cartão."
    );
  }

  // O limite é validado sobre o valor total
  // da compra, e não sobre cada parcela.

  await validateCreditLimit(
    data.cardId,
    data.userId,
    data.amount
  );

  const installmentAmounts = splitAmount(
    data.amount,
    installments
  );

  const installmentGroupId = randomUUID();

  const transactionsData = [];

  for (
    let index = 0;
    index < installments;
    index++
  ) {
    const installmentDate =
      addMonths(data.date, index);

    const invoice =
      await findOrCreateInvoice(
        data.cardId,
        data.userId,
        installmentDate
      );

    const installmentAmount =
      installmentAmounts[index];

    if (installmentAmount === undefined) {
      throw new Error(
        "Erro ao calcular o valor da parcela."
      );
    }

    transactionsData.push({
      description: data.description,
      amount: installmentAmount,
      date: installmentDate,
      type: data.type,
      userId: data.userId,

      ...(data.categoryId && {
        categoryId: data.categoryId,
      }),

      ...(data.paymentMethodId && {
        paymentMethodId: data.paymentMethodId,
      }),

      cardId: data.cardId,
      invoiceId: invoice.id,
      installmentGroupId,
      installmentNumber: index + 1,
      totalInstallments: installments,
    });
  }

  return prisma.transaction.createManyAndReturn({
    data: transactionsData,
  });
}
export async function findTransactionsByUser(
  userId: string
) {
  return prisma.transaction.findMany({
    where: {
      userId,
    },

    include: {
      category: true,
      paymentMethod: true,
      card: true,
      invoice: true,
    },

    orderBy: {
      date: "desc",
    },
  });
}

export async function updateTransaction(
  transactionId: string,
  userId: string,
  data: UpdateTransactionData
) {  // =========================
  // VALIDAÇÕES DE RECEITA
  // =========================

  if (data.type === "receita") {
    if (data.cardId) {
      throw new Error(
        "Receitas não podem ser vinculadas a cartões."
      );
    }

  }

  // =========================
  // VALIDAÇÃO DA CATEGORIA
  // =========================

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    if (category.type !== data.type) {
      throw new Error(
        "O tipo da transação não corresponde ao tipo da categoria."
      );
    }
  }

  // =========================
  const existingTransaction =
    await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

  if (!existingTransaction) {
    return null;
  }

  /*
   * Validação da categoria
   */
  if (data.categoryId) {
    const category =
      await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId,
        },
      });

    if (!category) {
      throw new Error(
        "Categoria não encontrada."
      );
    }

    if (category.type !== data.type) {
      throw new Error(
        "O tipo da transação não corresponde ao tipo da categoria."
      );
    }
  }

  /*
   * Validação da forma de pagamento
   */
  await validatePayment(
    userId,
    data.paymentMethodId,
    data.cardId
  );

  /*
   * ============================================================
   * EDIÇÃO DE COMPRA PARCELADA
   * ============================================================
   */
  if (existingTransaction.installmentGroupId) {
    const installmentGroupId =
      existingTransaction.installmentGroupId;

    /*
     * Busca todas as parcelas do grupo.
     */
    const installments =
      await prisma.transaction.findMany({
        where: {
          installmentGroupId,
          userId,
        },

        orderBy: {
          installmentNumber: "asc",
        },

        include: {
          invoice: true,
        },
      });

    if (installments.length === 0) {
      throw new Error(
        "Parcelas da compra não encontradas."
      );
    }

    /*
     * Não permitimos alterar uma compra parcelada
     * que já tenha alguma parcela em uma fatura paga.
     */
    const hasPaidInvoice =
      installments.some(
        (installment) =>
          installment.invoice?.status ===
          "paga"
      );

    if (hasPaidInvoice) {
      throw new Error(
        "Não é possível editar uma compra parcelada que possui parcela em uma fatura paga."
      );
    }

    /*
     * Recupera a quantidade original de parcelas.
     */
    const totalInstallments =
      existingTransaction.totalInstallments ??
      installments.length;

    /*
     * Compra parcelada precisa continuar sendo
     * uma compra no crédito.
     */
    let paymentMethodName = "";

    if (data.paymentMethodId) {
      const paymentMethod =
        await prisma.paymentMethod.findFirst({
          where: {
            id: data.paymentMethodId,
            userId,
          },
        });

      if (!paymentMethod) {
        throw new Error(
          "Forma de pagamento não encontrada."
        );
      }

      paymentMethodName =
        paymentMethod.name
          .trim()
          .toLowerCase();
    }

    if (
      paymentMethodName !== "crédito"
    ) {
      throw new Error(
        "Uma compra parcelada deve permanecer na forma de pagamento crédito."
      );
    }

    if (!data.cardId) {
      throw new Error(
        "Uma compra parcelada exige um cartão."
      );
    }

    /*
     * Valida o novo cartão.
     *
     * O valor total da compra é considerado
     * para verificar o limite disponível.
     */
    await validateCreditLimit(
      data.cardId,
      userId,
      data.amount
    );

    /*
     * Divide novamente o valor total
     * entre as mesmas quantidades de parcelas.
     */
    const installmentAmounts =
      splitAmount(
        data.amount,
        totalInstallments
      );

    /*
     * Descobre a primeira parcela do grupo.
     *
     * A nova data enviada pelo usuário será
     * considerada como a data da primeira parcela.
     */
    const firstInstallment =
      installments[0];

    if (!firstInstallment) {
      throw new Error(
        "Primeira parcela não encontrada."
      );
    }

    /*
     * Cria/obtém as novas faturas de cada parcela.
     */
    const updatedTransactions = [];

    for (
      let index = 0;
      index < totalInstallments;
      index++
    ) {
      const installmentDate =
        addMonths(data.date, index);

      const invoice =
        await findOrCreateInvoice(
          data.cardId,
          userId,
          installmentDate
        );

      const installmentAmount =
        installmentAmounts[index];

      if (
        installmentAmount === undefined
      ) {
        throw new Error(
          "Erro ao calcular o valor da parcela."
        );
      }

      updatedTransactions.push({
        transactionId:
          installments[index]?.id,
        amount: installmentAmount,
        date: installmentDate,
        invoiceId: invoice.id,
        installmentNumber:
          index + 1,
      });
    }

    /*
     * Atualiza todas as parcelas.
     */
    const results =
      await prisma.$transaction(
        updatedTransactions.map(
          (transaction) => {
            if (!transaction.transactionId) {
              throw new Error(
                "Parcela não encontrada durante a atualização."
              );
            }

            return prisma.transaction.update({
              where: {
                id: transaction.transactionId,
              },

              data: {
                description: data.description,
              
                amount:
                  transaction.amount,
              
                date:
                  transaction.date,
              
                type:
                  data.type,
              
                categoryId:
                  data.categoryId ?? null,
              
                paymentMethodId:
                  data.paymentMethodId ?? null,
              
                ...(data.cardId && {
                  cardId: data.cardId,
                }),
              
                invoiceId:
                  transaction.invoiceId,
              
                installmentNumber:
                  transaction.installmentNumber,
              
                totalInstallments:
                  totalInstallments,
              },
              include: {
                category: true,
                paymentMethod: true,
                card: true,
                invoice: true,
              },
            });
          }
        )
      );

    return results;
  }

  /*
   * ============================================================
   * EDIÇÃO DE TRANSAÇÃO NORMAL
   * ============================================================
   */

  let invoiceId:
    | string
    | null = null;

  /*
   * Se a nova forma de pagamento for crédito,
   * precisamos verificar o cartão e a fatura.
   */
  if (
    data.paymentMethodId &&
    data.cardId
  ) {
    const paymentMethod =
      await prisma.paymentMethod.findFirst({
        where: {
          id: data.paymentMethodId,
          userId,
        },
      });

    if (
      paymentMethod?.name
        .trim()
        .toLowerCase() === "crédito"
    ) {
      const invoice =
        await findOrCreateInvoice(
          data.cardId,
          userId,
          data.date
        );

      invoiceId = invoice.id;

      let amountToValidate =
        data.amount;

      /*
       * Se a transação continuar na mesma
       * fatura, precisamos considerar apenas
       * a diferença do valor.
       */
      if (
        existingTransaction.invoiceId ===
        invoice.id
      ) {
        const difference =
          data.amount -
          Number(
            existingTransaction.amount
          );

        amountToValidate =
          difference > 0
            ? difference
            : 0;
      }

      if (amountToValidate > 0) {
        await validateCreditLimit(
          data.cardId,
          userId,
          amountToValidate
        );
      }
    }
  }

  return prisma.transaction.update({
    where: {
      id: transactionId,
    },

    data: {
      description: data.description,
      amount: data.amount,
      date: data.date,
      type: data.type,

      categoryId:
        data.categoryId ?? null,

      paymentMethodId:
        data.paymentMethodId ?? null,

      cardId:
        data.cardId ?? null,

      invoiceId,
    },

    include: {
      category: true,
      paymentMethod: true,
      card: true,
      invoice: true,
    },
  });
}

export async function deleteTransaction(
  transactionId: string,
  userId: string
) {
  const existingTransaction =
    await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

  if (!existingTransaction) {
    return null;
  }

  /*
   * Se a transação fizer parte de um
   * parcelamento, excluímos todas as parcelas.
   */
  if (existingTransaction.installmentGroupId) {
    return prisma.transaction.deleteMany({
      where: {
        installmentGroupId:
          existingTransaction.installmentGroupId,

        userId,
      },
    });
  }

  /*
   * Caso seja uma transação normal,
   * excluímos somente ela.
   */
  return prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
}
async function validateCategory(
  userId: string,
  categoryId: string | undefined,
  transactionType: string
) {
  if (!categoryId) {
    return;
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
  });

  if (!category) {
    throw new Error("Categoria não encontrada.");
  }

  if (category.type.toLowerCase() !== transactionType.toLowerCase()) {
    throw new Error(
      "A categoria selecionada não pertence ao tipo da transação."
    );
  }
}