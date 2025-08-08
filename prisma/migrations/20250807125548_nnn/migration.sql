/*
  Warnings:

  - You are about to drop the column `availabilityType` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `Professional` table. All the data in the column will be lost.
  - Added the required column `availabilityTypeId` to the `Professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceLevelId` to the `Professional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Professional" DROP COLUMN "availabilityType",
DROP COLUMN "experienceLevel",
ADD COLUMN     "availabilityTypeId" TEXT NOT NULL,
ADD COLUMN     "experienceLevelId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ExperienceLevel";

-- DropEnum
DROP TYPE "GeneralAvailability";

-- CreateTable
CREATE TABLE "GeneralAvailability" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "GeneralAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "ExperienceLevel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_availabilityTypeId_fkey" FOREIGN KEY ("availabilityTypeId") REFERENCES "GeneralAvailability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_experienceLevelId_fkey" FOREIGN KEY ("experienceLevelId") REFERENCES "ExperienceLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
