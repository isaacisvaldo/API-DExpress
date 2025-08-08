/*
  Warnings:

  - You are about to drop the `AccountSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountSettings" DROP CONSTRAINT "AccountSettings_userId_fkey";

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '---';

-- DropTable
DROP TABLE "AccountSettings";
