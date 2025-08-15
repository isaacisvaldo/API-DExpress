/*
  Warnings:

  - You are about to drop the column `userId` on the `ClientCompanyProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientCompanyProfile" DROP CONSTRAINT "ClientCompanyProfile_userId_fkey";

-- DropIndex
DROP INDEX "ClientCompanyProfile_userId_key";

-- AlterTable
ALTER TABLE "ClientCompanyProfile" DROP COLUMN "userId";
