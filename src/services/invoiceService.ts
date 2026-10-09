
import prisma from "../config/prisma.js";

interface CreateInvoiceData {
  cardId: string;
  reference: string;
  closingDate: Date;
  dueDate: Date;
}

async function calculateCardUsedLimit(cardId: string) {
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

  return invoices.reduce((total, invoice) => {
    const invoiceTotal = invoice.transactions
      .filter((transaction) => transaction.type === "despesa")
      .reduce(
        (sum, transaction) => sum + Number(transaction.amount),
        0
      );

    return total + invoiceTotal;
  }, 0);
}

export async function createInvoice(
  data: CreateInvoiceData,
  userId: string
) {
  const card = await prisma.card.findFirst({
    where: {
      id: data.cardId,
      userId,
    },
  });

  if (!card) {
    throw new Error("Cartão não encontrado.");
  }

  return prisma.invoice.create({
    data: {
      cardId: data.cardId,
      reference: data.reference,
      closingDate: data.closingDate,
      dueDate: data.dueDate,
    },
  });
}

async function closeExpiredInvoices() {
  const now = new Date();

  const invoices = await prisma.invoice.findMany({
    where: {
      status: "aberta",
    },
  });

  for (const invoice of invoices) {
    const closingDate = new Date(invoice.closingDate);

    // A fatura só fecha depois do dia de fechamento.
    const endOfClosingDay = new Date(
      closingDate.getFullYear(),
      closingDate.getMonth(),
      closingDate.getDate(),
      23,
      59,
      59,
      999
    );

    if (now > endOfClosingDay) {
      await prisma.invoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          status: "fechada",
        },
      });
    }
  }
}

export async function findInvoicesByUser(userId: string) {
  await closeExpiredInvoices();

  const invoices = await prisma.invoice.findMany({
    where: {
      card: {
        userId,
      },
    },
    include: {
      card: true,
      transactions: true,
    },
    orderBy: {
      dueDate: "desc",
    },
  });

  return Promise.all(
    invoices.map(async (invoice) => {
      const total = invoice.transactions
        .filter((transaction) => transaction.type === "despesa")
        .reduce(
          (sum, transaction) => sum + Number(transaction.amount),
          0
        );

      const usedLimit = await calculateCardUsedLimit(invoice.cardId);

      const creditLimit =
        invoice.card.creditLimit !== null
          ? Number(invoice.card.creditLimit)
          : null;

      const availableLimit =
        creditLimit !== null
          ? creditLimit - usedLimit
          : null;

      return {
        ...invoice,
        total: total.toFixed(2),
        creditLimit:
          creditLimit !== null
            ? creditLimit.toFixed(2)
            : null,
        availableLimit:
          availableLimit !== null
            ? availableLimit.toFixed(2)
            : null,
      };
    })
  );
}

export async function findInvoiceById(
  invoiceId: string,
  userId: string
) {
  await closeExpiredInvoices();

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      card: {
        userId,
      },
    },
    include: {
      card: true,
      transactions: {
        include: {
          category: true,
          paymentMethod: true,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!invoice) {
    return null;
  }

  const total = invoice.transactions
    .filter((transaction) => transaction.type === "despesa")
    .reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0
    );

  const usedLimit = await calculateCardUsedLimit(invoice.cardId);

  const creditLimit =
    invoice.card.creditLimit !== null
      ? Number(invoice.card.creditLimit)
      : null;

  const availableLimit =
    creditLimit !== null
      ? creditLimit - usedLimit
      : null;

  return {
    ...invoice,
    total: total.toFixed(2),
    creditLimit:
      creditLimit !== null
        ? creditLimit.toFixed(2)
        : null,
    availableLimit:
      availableLimit !== null
        ? availableLimit.toFixed(2)
        : null,
  };
}

export async function payInvoice(
  invoiceId: string,
  userId: string
) {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      card: {
        userId,
      },
    },
  });

  if (!invoice) {
    throw new Error("Fatura não encontrada.");
  }

  if (invoice.status === "paga") {
    throw new Error("A fatura já está paga.");
  }

  return prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      status: "paga",
    },
  });
}

export async function findOrCreateInvoice(
  cardId: string,
  userId: string,
  date: Date
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

  const closingDay = card.closingDay ?? 1;
  const dueDay = card.dueDay ?? 1;

  let invoiceYear = date.getFullYear();
  let invoiceMonth = date.getMonth();

  // Compra feita até o dia de fechamento pertence
  // à fatura daquele mês.
  //
  // Compra feita depois do fechamento pertence
  // à fatura do mês seguinte.
  if (date.getDate() > closingDay) {
    invoiceMonth++;

    if (invoiceMonth > 11) {
      invoiceMonth = 0;
      invoiceYear++;
    }
  }

  const reference = `${invoiceYear}-${String(
    invoiceMonth + 1
  ).padStart(2, "0")}`;

  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      cardId,
      reference,
    },
  });

  // Uma fatura fechada ou paga não pode receber
  // novas compras.
  if (existingInvoice) {
    if (
      existingInvoice.status === "paga" ||
      existingInvoice.status === "fechada"
    ) {
      throw new Error(
        "Não é possível lançar uma nova compra em uma fatura que já foi fechada."
      );
    }

    return existingInvoice;
  }

  const closingDate = new Date(
    invoiceYear,
    invoiceMonth,
    closingDay
  );

  let dueYear = invoiceYear;
  let dueMonth = invoiceMonth;

  // Se o vencimento for numericamente anterior
  // ao fechamento, o vencimento acontece no mês seguinte.
  if (dueDay < closingDay) {
    dueMonth++;

    if (dueMonth > 11) {
      dueMonth = 0;
      dueYear++;
    }
  }

  const dueDate = new Date(
    dueYear,
    dueMonth,
    dueDay
  );

  return prisma.invoice.create({
    data: {
      cardId,
      reference,
      closingDate,
      dueDate,
    },
  });
}

