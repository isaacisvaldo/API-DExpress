/*
  Warnings:

  - You are about to drop the column `paymentMethodId` on the `CompanyPackage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyPackage" DROP CONSTRAINT "CompanyPackage_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "CompanyPackage" DROP COLUMN "paymentMethodId";

-- CreateTable
CREATE TABLE "PaymentCompanyPackage" (
    "companyPackageId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentCompanyPackage_pkey" PRIMARY KEY ("paymentId","companyPackageId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentCompanyPackage" ADD CONSTRAINT "PaymentCompanyPackage_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentCompanyPackage" ADD CONSTRAINT "PaymentCompanyPackage_companyPackageId_fkey" FOREIGN KEY ("companyPackageId") REFERENCES "CompanyPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
