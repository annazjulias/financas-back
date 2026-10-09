
import prisma from "../config/prisma.js";

interface CreateCategoryData {
  name: string;
  type: string;
  userId: string;
}

export async function createCategory(data: CreateCategoryData) {
  const category = await prisma.category.create({
    data: {
      name: data.name,
      type: data.type,
      userId: data.userId,
    },
  });

  return category;
}

export async function findCategoriesByUser(userId: string) {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

export async function updateCategory(
  categoryId: string,
  userId: string,
  data: {
    name: string;
    type: string;
  }
) {
  const category = await prisma.category.updateMany({
    where: {
      id: categoryId,
      userId,
    },
    data: {
      name: data.name,
      type: data.type,
    },
  });

  return category;
}
export async function deleteCategory(
  categoryId: string,
  userId: string
) {
  const result = await prisma.category.deleteMany({
    where: {
      id: categoryId,
      userId,
    },
  });

  return result;
}