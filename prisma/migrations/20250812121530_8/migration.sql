/*
  Warnings:

  - You are about to drop the column `state` on the `ClientCompanyProfile` table. All the data in the column will be lost.
  - Added the required column `districtId` to the `ClientCompanyProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClientProfile" DROP CONSTRAINT "ClientProfile_userId_fkey";

-- AlterTable
ALTER TABLE "ClientCompanyProfile" DROP COLUMN "state",
ADD COLUMN     "districtId" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ClientProfile" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCompanyProfile" ADD CONSTRAINT "ClientCompanyProfile_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
