-- DropForeignKey
ALTER TABLE "CompanyPackage" DROP CONSTRAINT "CompanyPackage_clientCompanyProfileId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyPackage" DROP CONSTRAINT "CompanyPackage_packageId_fkey";

-- AlterTable
ALTER TABLE "CompanyPackage" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "CompanyPackage" ADD CONSTRAINT "CompanyPackage_clientCompanyProfileId_fkey" FOREIGN KEY ("clientCompanyProfileId") REFERENCES "ClientCompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyPackage" ADD CONSTRAINT "CompanyPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
