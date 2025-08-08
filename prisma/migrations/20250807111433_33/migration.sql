/*
  Warnings:

  - You are about to drop the column `gender` on the `AdminUser` table. All the data in the column will be lost.
  - The `gender` column on the `JobApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `courses` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `desiredPosition` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `skillsAndQualities` on the `Professional` table. All the data in the column will be lost.
  - Changed the type of `maritalStatus` on the `JobApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `desiredPosition` on the `JobApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `desiredPositionId` to the `Professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderId` to the `Professional` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender1" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MaritalStatus1" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'STABLE_UNION');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('BABYSITTER', 'HOUSEKEEPER', 'COOK', 'CAREGIVER', 'GARDENER', 'IRONING', 'CLEANING_ASSISTANT', 'OTHER');

-- AlterTable
ALTER TABLE "AdminUser" DROP COLUMN "gender",
ADD COLUMN     "genderId" TEXT;

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender1" NOT NULL DEFAULT 'MALE',
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus1" NOT NULL,
DROP COLUMN "desiredPosition",
ADD COLUMN     "desiredPosition" "Position" NOT NULL;

-- AlterTable
ALTER TABLE "Professional" DROP COLUMN "courses",
DROP COLUMN "desiredPosition",
DROP COLUMN "gender",
DROP COLUMN "languages",
DROP COLUMN "skillsAndQualities",
ADD COLUMN     "desiredPositionId" TEXT NOT NULL,
ADD COLUMN     "genderId" TEXT NOT NULL,
ADD COLUMN     "highestDegreeId" TEXT,
ADD COLUMN     "maritalStatusId" TEXT;

-- DropEnum
DROP TYPE "DesiredPosition";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "MaritalStatus";

-- CreateTable
CREATE TABLE "Gender" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaritalStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "MaritalStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighestDegree" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "HighestDegree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesiredPosition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DesiredPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalCourses" (
    "professionalId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "ProfessionalCourses_pkey" PRIMARY KEY ("professionalId","courseId")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalLanguages" (
    "professionalId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "level" TEXT,

    CONSTRAINT "ProfessionalLanguages_pkey" PRIMARY KEY ("professionalId","languageId")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalSkills" (
    "professionalId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "ProfessionalSkills_pkey" PRIMARY KEY ("professionalId","skillId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gender_name_key" ON "Gender"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MaritalStatus_name_key" ON "MaritalStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HighestDegree_name_key" ON "HighestDegree"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DesiredPosition_name_key" ON "DesiredPosition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_desiredPositionId_fkey" FOREIGN KEY ("desiredPositionId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "DesiredPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_maritalStatusId_fkey" FOREIGN KEY ("maritalStatusId") REFERENCES "MaritalStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_highestDegreeId_fkey" FOREIGN KEY ("highestDegreeId") REFERENCES "HighestDegree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalCourses" ADD CONSTRAINT "ProfessionalCourses_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalCourses" ADD CONSTRAINT "ProfessionalCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalLanguages" ADD CONSTRAINT "ProfessionalLanguages_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalLanguages" ADD CONSTRAINT "ProfessionalLanguages_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalSkills" ADD CONSTRAINT "ProfessionalSkills_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalSkills" ADD CONSTRAINT "ProfessionalSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;
