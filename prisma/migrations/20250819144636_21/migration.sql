/*
  Warnings:

  - You are about to drop the column `baseSalary` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `equivalent` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `totalBalance` on the `Package` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Package" DROP COLUMN "baseSalary",
DROP COLUMN "cost",
DROP COLUMN "equivalent",
DROP COLUMN "hours",
DROP COLUMN "percentage",
DROP COLUMN "totalBalance",
ADD COLUMN     "details" JSONB,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
