import prisma from "../config/prisma.js";

interface CreateCardData {
  name: string;
  creditLimit?: number;
  closingDay?: number;
  dueDay?: number;
  userId: string;
}

export async function createCard(data: CreateCardData) {
  const card = await prisma.card.create({
    data: {
      name: data.name,
      userId: data.userId,
      ...(data.creditLimit !== undefined && {
        creditLimit: data.creditLimit,
      }),
      ...(data.closingDay !== undefined && {
        closingDay: data.closingDay,
      }),
      ...(data.dueDay !== undefined && {
        dueDay: data.dueDay,
      }),
    },
  });

  return card;
}

export async function findCardsByUser(userId: string) {
  const cards = await prisma.card.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return cards;
}

export async function updateCard(
  cardId: string,
  userId: string,
  data: {
    name: string;
    creditLimit?: number;
    closingDay?: number;
    dueDay?: number;
  }
) {
  const result = await prisma.card.updateMany({
    where: {
      id: cardId,
      userId,
    },
    data: {
      name: data.name,
      ...(data.creditLimit !== undefined && {
        creditLimit: data.creditLimit,
      }),
      ...(data.closingDay !== undefined && {
        closingDay: data.closingDay,
      }),
      ...(data.dueDay !== undefined && {
        dueDay: data.dueDay,
      }),
    },
  });

  return result;
}

export async function deleteCard(
  cardId: string,
  userId: string
) {
  const result = await prisma.card.deleteMany({
    where: {
      id: cardId,
      userId,
    },
  });

  return result;
}