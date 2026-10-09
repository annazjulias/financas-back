import prisma from "../config/prisma.js";

export async function findOrCreateUser(
  userId: string,
  email: string
) {
  const user = await prisma.user.upsert({
    where: {
      id: userId,
    },
    update: {
      email,
    },
    create: {
      id: userId,
      email,
    },
  });

  return user;
}