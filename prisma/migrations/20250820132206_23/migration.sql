/*
  Warnings:

  - You are about to drop the `CompanyPackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentCompanyPackage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'PENDING_SIGNATURE', 'ACTIVE', 'PAUSED', 'COMPLETED', 'TERMINATED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "CompanyPackage" DROP CONSTRAINT "CompanyPackage_clientCompanyProfileId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyPackage" DROP CONSTRAINT "CompanyPackage_packageId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentCompanyPackage" DROP CONSTRAINT "PaymentCompanyPackage_companyPackageId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentCompanyPackage" DROP CONSTRAINT "PaymentCompanyPackage_paymentId_fkey";

-- DropTable
DROP TABLE "CompanyPackage";

-- DropTable
DROP TABLE "PaymentCompanyPackage";

-- DropEnum
DROP TYPE "StatusCompanyPackage";

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "title" TEXT,
    "professionalId" TEXT,
    "clientType" "UserType" NOT NULL,
    "individualClientId" TEXT,
    "companyClientId" TEXT,
    "packageId" TEXT,
    "desiredPositionId" TEXT,
    "description" TEXT NOT NULL,
    "serviceFrequency" "ServiceFrequency",
    "locationId" TEXT NOT NULL,
    "agreedValue" DOUBLE PRECISION NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "finalValue" DOUBLE PRECISION NOT NULL,
    "paymentTerms" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractPayment" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractNumber_key" ON "Contract"("contractNumber");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_individualClientId_fkey" FOREIGN KEY ("individualClientId") REFERENCES "ClientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_companyClientId_fkey" FOREIGN KEY ("companyClientId") REFERENCES "ClientCompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_desiredPositionId_fkey" FOREIGN KEY ("desiredPositionId") REFERENCES "DesiredPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractPayment" ADD CONSTRAINT "ContractPayment_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractPayment" ADD CONSTRAINT "ContractPayment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
