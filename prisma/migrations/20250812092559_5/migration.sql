/*
  Warnings:

  - You are about to drop the column `clientProfileId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `companyProfileId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CompanyProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ClientProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ClientProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ClientProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `avatar` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CompanyProfile" DROP CONSTRAINT "CompanyProfile_sectorId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyProfileId_fkey";

-- DropIndex
DROP INDEX "User_clientProfileId_key";

-- DropIndex
DROP INDEX "User_companyProfileId_key";

-- AlterTable
ALTER TABLE "ClientProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clientProfileId",
DROP COLUMN "companyProfileId",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'user.png';

-- DropTable
DROP TABLE "CompanyProfile";

-- CreateTable
CREATE TABLE "ClientCompanyProfile" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "optionalContact" TEXT,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,

    CONSTRAINT "ClientCompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientCompanyProfile_email_key" ON "ClientCompanyProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCompanyProfile_userId_key" ON "ClientCompanyProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_userId_key" ON "ClientProfile"("userId");

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCompanyProfile" ADD CONSTRAINT "ClientCompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCompanyProfile" ADD CONSTRAINT "ClientCompanyProfile_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
