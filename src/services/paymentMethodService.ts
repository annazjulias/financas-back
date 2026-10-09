import prisma from "../config/prisma.js";

interface CreatePaymentMethodData {
  name: string;
  userId: string;
}

export async function createPaymentMethod(
  data: CreatePaymentMethodData
) {
  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      name: data.name,
      userId: data.userId,
    },
  });

  return paymentMethod;
}

export async function findPaymentMethodsByUser(
  userId: string
) {
  const paymentMethods = await prisma.paymentMethod.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return paymentMethods;
}export async function updatePaymentMethod(
  paymentMethodId: string,
  userId: string,
  name: string
) {
  const result = await prisma.paymentMethod.updateMany({
    where: {
      id: paymentMethodId,
      userId,
    },
    data: {
      name,
    },
  });

  return result;
}

export async function deletePaymentMethod(
  paymentMethodId: string,
  userId: string
) {
  const result = await prisma.paymentMethod.deleteMany({
    where: {
      id: paymentMethodId,
      userId,
    },
  });

  return result;
}