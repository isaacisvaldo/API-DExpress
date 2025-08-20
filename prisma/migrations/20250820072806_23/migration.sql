/*
  Warnings:

  - You are about to drop the column `endDate` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `ServiceRequest` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ServiceFrequency" AS ENUM ('MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'ANNUALLY', 'BIENNIALLY');

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "serviceFrequency" "ServiceFrequency" NOT NULL DEFAULT 'MONTHLY';
