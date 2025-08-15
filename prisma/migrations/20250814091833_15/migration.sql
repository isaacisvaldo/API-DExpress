/*
  Warnings:

  - You are about to drop the column `paymentFrequencyId` on the `CompanyPackage` table. All the data in the column will be lost.
  - You are about to drop the `PaymentFrequency` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyPackage" DROP CONSTRAINT "CompanyPackage_paymentFrequencyId_fkey";

-- AlterTable
ALTER TABLE "CompanyPackage" DROP COLUMN "paymentFrequencyId";

-- DropTable
DROP TABLE "PaymentFrequency";
