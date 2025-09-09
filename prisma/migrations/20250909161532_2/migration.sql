/*
  Warnings:

  - The values [MONTHLY,BIMONTHLY,QUARTERLY,BIENNIALLY] on the enum `ServiceFrequency` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `availabilityTypeId` on the `Professional` table. All the data in the column will be lost.
  - The `knownDiseases` column on the `Professional` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ServiceFrequency_new" AS ENUM ('DAILY', 'SEMIANNUALLY', 'ANNUALLY');
ALTER TABLE "Contract" ALTER COLUMN "serviceFrequency" DROP DEFAULT;
ALTER TABLE "ServiceRequest" ALTER COLUMN "serviceFrequency" DROP DEFAULT;
ALTER TABLE "ServiceRequest" ALTER COLUMN "serviceFrequency" TYPE "ServiceFrequency_new" USING ("serviceFrequency"::text::"ServiceFrequency_new");
ALTER TABLE "Contract" ALTER COLUMN "serviceFrequency" TYPE "ServiceFrequency_new" USING ("serviceFrequency"::text::"ServiceFrequency_new");
ALTER TYPE "ServiceFrequency" RENAME TO "ServiceFrequency_old";
ALTER TYPE "ServiceFrequency_new" RENAME TO "ServiceFrequency";
DROP TYPE "ServiceFrequency_old";
COMMIT;

-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "serviceFrequency" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Professional" DROP COLUMN "availabilityTypeId",
DROP COLUMN "knownDiseases",
ADD COLUMN     "knownDiseases" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ServiceRequest" ALTER COLUMN "serviceFrequency" DROP NOT NULL,
ALTER COLUMN "serviceFrequency" DROP DEFAULT;
