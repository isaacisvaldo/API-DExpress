/*
  Warnings:

  - A unique constraint covering the columns `[identityNumber]` on the table `AdminUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthDate` to the `AdminUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `AdminUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identityNumber` to the `AdminUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `AdminUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberphone` to the `AdminUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "identityNumber" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "numberphone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE';

-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE';

-- CreateTable
CREATE TABLE "ProfessionalExperience" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "localTrabalho" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "tempo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalExperience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_identityNumber_key" ON "AdminUser"("identityNumber");

-- AddForeignKey
ALTER TABLE "ProfessionalExperience" ADD CONSTRAINT "ProfessionalExperience_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
