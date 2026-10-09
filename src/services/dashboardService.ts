import prisma from "../config/prisma.js";

interface DashboardPeriod {
  userId: string;
  startDate: Date;
  endDate: Date;
}

export async function getDashboardSummary({
  userId,
  startDate,
  endDate,
}: DashboardPeriod) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
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

  let totalReceitas = 0;
  let totalDespesas = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);

    if (transaction.type === "receita") {
      totalReceitas += amount;
    }

    if (transaction.type === "despesa") {
      totalDespesas += amount;
    }
  }

  const saldo = totalReceitas - totalDespesas;

  // =========================
  // CATEGORIAS DE ENTRADAS
  // =========================

  const categoriasReceitasMap = new Map<
    string,
    {
      categoryId: string | null;
      categoryName: string;
      total: number;
    }
  >();

  // =========================
  // CATEGORIAS DE SAÍDAS
  // =========================

  const categoriasDespesasMap = new Map<
    string,
    {
      categoryId: string | null;
      categoryName: string;
      total: number;
    }
  >();

  // =========================
  // FORMAS DE PAGAMENTO
  // =========================

  const formasPagamentoMap = new Map<
    string,
    {
      paymentMethodId: string | null;
      paymentMethodName: string;
      total: number;
    }
  >();

  // =========================
  // CARTÕES
  // =========================

  const cartoesMap = new Map<
    string,
    {
      cardId: string;
      cardName: string;
      total: number;
    }
  >();

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);

    // =========================
    // RECEITAS
    // =========================

    if (transaction.type === "receita") {
      const categoryKey =
        transaction.categoryId ?? "sem-categoria";

      const existingCategory =
        categoriasReceitasMap.get(categoryKey);

      if (existingCategory) {
        existingCategory.total += amount;
      } else {
        categoriasReceitasMap.set(categoryKey, {
          categoryId: transaction.categoryId,
          categoryName:
            transaction.category?.name ?? "Sem categoria",
          total: amount,
        });
      }

      continue;
    }

    // =========================
    // DESPESAS
    // =========================

    if (transaction.type !== "despesa") {
      continue;
    }

    const categoryKey =
      transaction.categoryId ?? "sem-categoria";

    const existingCategory =
      categoriasDespesasMap.get(categoryKey);

    if (existingCategory) {
      existingCategory.total += amount;
    } else {
      categoriasDespesasMap.set(categoryKey, {
        categoryId: transaction.categoryId,
        categoryName:
          transaction.category?.name ?? "Sem categoria",
        total: amount,
      });
    }

    // =========================
    // FORMAS DE PAGAMENTO
    // =========================

    const paymentMethodKey =
      transaction.paymentMethodId ??
      "sem-forma-pagamento";

    const existingPaymentMethod =
      formasPagamentoMap.get(paymentMethodKey);

    if (existingPaymentMethod) {
      existingPaymentMethod.total += amount;
    } else {
      formasPagamentoMap.set(paymentMethodKey, {
        paymentMethodId: transaction.paymentMethodId,
        paymentMethodName:
          transaction.paymentMethod?.name ??
          "Sem forma de pagamento",
        total: amount,
      });
    }

    // =========================
    // CARTÕES
    // =========================

    if (transaction.cardId && transaction.card) {
      const existingCard =
        cartoesMap.get(transaction.cardId);

      if (existingCard) {
        existingCard.total += amount;
      } else {
        cartoesMap.set(transaction.cardId, {
          cardId: transaction.cardId,
          cardName: transaction.card.name,
          total: amount,
        });
      }
    }
  }

  // =========================
  // ORGANIZAÇÃO DAS CATEGORIAS
  // =========================

  const incomeCategories = Array.from(
    categoriasReceitasMap.values()
  ).sort((a, b) => b.total - a.total);

  const expenseCategories = Array.from(
    categoriasDespesasMap.values()
  ).sort((a, b) => b.total - a.total);

  // =========================
  // FORMAS DE PAGAMENTO
  // =========================

  const paymentMethods = Array.from(
    formasPagamentoMap.values()
  ).sort((a, b) => b.total - a.total);

  // =========================
  // CARTÕES
  // =========================

  const cards = Array.from(
    cartoesMap.values()
  ).sort((a, b) => b.total - a.total);

  // =========================
  // FATURAS ABERTAS E FECHADAS
  // =========================

  const openInvoices = await prisma.invoice.findMany({
    where: {
      card: {
        userId,
      },
      status: {
        in: ["aberta", "fechada"],
      },
    },
    include: {
      card: true,
      transactions: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  const invoices = openInvoices.map((invoice) => {
    const total = invoice.transactions.reduce(
      (sum, transaction) => {
        if (transaction.type !== "despesa") {
          return sum;
        }

        return sum + Number(transaction.amount);
      },
      0
    );

    return {
      id: invoice.id,
      reference: invoice.reference,
      status: invoice.status,
      closingDate: invoice.closingDate,
      dueDate: invoice.dueDate,
      card: {
        id: invoice.card.id,
        name: invoice.card.name,
      },
      total: total.toFixed(2),
    };
  });

  // =========================
  // RESUMO DOS CARTÕES
  // =========================

  const cardsWithLimit = await prisma.card.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const cardsSummary = await Promise.all(
    cardsWithLimit.map(async (card) => {
      const openTransactions =
        await prisma.transaction.findMany({
          where: {
            cardId: card.id,
            type: "despesa",
            invoice: {
              status: {
                in: ["aberta", "fechada"],
              },
            },
          },
          select: {
            amount: true,
          },
        });

      const usedLimit =
        openTransactions.reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        );

      const creditLimit =
        card.creditLimit !== null
          ? Number(card.creditLimit)
          : null;

      const availableLimit =
        creditLimit !== null
          ? Math.max(
              creditLimit - usedLimit,
              0
            )
          : null;

      return {
        id: card.id,
        name: card.name,
        creditLimit:
          creditLimit !== null
            ? creditLimit.toFixed(2)
            : null,
        usedLimit: usedLimit.toFixed(2),
        availableLimit:
          availableLimit !== null
            ? availableLimit.toFixed(2)
            : null,
      };
    })
  );

  // =========================
  // RETORNO DO DASHBOARD
  // =========================

  return {
    period: {
      startDate,
      endDate,
    },

    summary: {
      totalReceitas: totalReceitas.toFixed(2),
      totalDespesas: totalDespesas.toFixed(2),
      saldo: saldo.toFixed(2),
    },

    categories: {
      income: incomeCategories.map((category) => ({
        ...category,
        total: category.total.toFixed(2),
      })),

      expenses: expenseCategories.map((category) => ({
        ...category,
        total: category.total.toFixed(2),
      })),
    },

    paymentMethods: paymentMethods.map(
      (paymentMethod) => ({
        ...paymentMethod,
        total: paymentMethod.total.toFixed(2),
      })
    ),

    cards: cards.map((card) => ({
      ...card,
      total: card.total.toFixed(2),
    })),

    creditCards: cardsSummary,

    openInvoices: invoices,
  };
}