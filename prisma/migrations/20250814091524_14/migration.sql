/*
  Warnings:

  - Added the required column `agreedValue` to the `CompanyPackage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalValue` to the `CompanyPackage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentFrequencyId` to the `CompanyPackage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethodId` to the `CompanyPackage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyPackage" ADD COLUMN     "agreedValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "finalValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentFrequencyId" TEXT NOT NULL,
ADD COLUMN     "paymentMethodId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PaymentFrequency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentFrequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentFrequency_name_key" ON "PaymentFrequency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "PaymentMethod"("name");

-- AddForeignKey
ALTER TABLE "CompanyPackage" ADD CONSTRAINT "CompanyPackage_paymentFrequencyId_fkey" FOREIGN KEY ("paymentFrequencyId") REFERENCES "PaymentFrequency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyPackage" ADD CONSTRAINT "CompanyPackage_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
