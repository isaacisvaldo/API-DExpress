/*
  Warnings:

  - Made the column `identityNumber` on table `ClientProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ClientProfile" DROP CONSTRAINT "ClientProfile_userId_fkey";

-- AlterTable
ALTER TABLE "ClientProfile" ALTER COLUMN "identityNumber" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
