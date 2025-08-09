/*
  Warnings:

  - Made the column `genderId` on table `AdminUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AdminUser" DROP CONSTRAINT "AdminUser_genderId_fkey";

-- AlterTable
ALTER TABLE "AdminUser" ALTER COLUMN "genderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
