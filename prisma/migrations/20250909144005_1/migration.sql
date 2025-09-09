/*
  Warnings:

  - You are about to drop the column `generalAvailabilityId` on the `JobApplication` table. All the data in the column will be lost.
  - The `knownDiseases` column on the `JobApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_generalAvailabilityId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "generalAvailabilityId",
DROP COLUMN "knownDiseases",
ADD COLUMN     "knownDiseases" BOOLEAN NOT NULL DEFAULT false;
