-- CreateEnum
CREATE TYPE "StatusRequest" AS ENUM ('PENDING', 'IN_REVIEW', 'PLAN_OFFERED', 'CONTRACT_GENERATED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StatusCompanyPackage" AS ENUM ('EM_ANALISE');

-- AlterTable
ALTER TABLE "CompanyPackage" ADD COLUMN     "statusCompanyPackage" "StatusCompanyPackage" NOT NULL DEFAULT 'EM_ANALISE';

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "requesterType" "UserType" NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhoneNumber" TEXT,
    "individualRequesterName" TEXT,
    "individualIdentityNumber" TEXT,
    "individualAddress" TEXT,
    "individualUserId" TEXT,
    "companyRequesterName" TEXT,
    "companyNif" TEXT,
    "companyAddress" TEXT,
    "companyDistrictId" TEXT,
    "companySectorId" TEXT,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusRequest" NOT NULL DEFAULT 'PENDING',
    "planId" TEXT,
    "professionalId" TEXT,
    "individualClientId" TEXT,
    "companyClientId" TEXT,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_individualClientId_fkey" FOREIGN KEY ("individualClientId") REFERENCES "ClientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_companyClientId_fkey" FOREIGN KEY ("companyClientId") REFERENCES "ClientCompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
