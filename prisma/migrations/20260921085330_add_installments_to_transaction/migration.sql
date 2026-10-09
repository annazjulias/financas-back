-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "installmentGroupId" TEXT,
ADD COLUMN     "installmentNumber" INTEGER,
ADD COLUMN     "totalInstallments" INTEGER;
