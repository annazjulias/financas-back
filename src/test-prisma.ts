import prisma from "./config/prisma.js";

async function main() {
  const users = await prisma.user.findMany();

  console.log("Conexão com PostgreSQL funcionando!");
  console.log("Usuários cadastrados:", users.length);
}

main()
  .catch((error) => {
    console.error("Erro ao conectar com o PostgreSQL:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });