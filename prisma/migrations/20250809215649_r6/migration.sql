/*
  Warnings:

  - You are about to drop the column `courses` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `desiredPosition` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `highestDegree` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `professionalExperience` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `skillsAndQualities` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProfessionalSpecialties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `desiredPositionId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `highestDegreeId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Professional" DROP CONSTRAINT "Professional_availabilityTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Professional" DROP CONSTRAINT "Professional_desiredPositionId_fkey";

-- DropForeignKey
ALTER TABLE "Professional" DROP CONSTRAINT "Professional_genderId_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalSpecialties" DROP CONSTRAINT "_ProfessionalSpecialties_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalSpecialties" DROP CONSTRAINT "_ProfessionalSpecialties_B_fkey";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "courses",
DROP COLUMN "desiredPosition",
DROP COLUMN "gender",
DROP COLUMN "highestDegree",
DROP COLUMN "languages",
DROP COLUMN "maritalStatus",
DROP COLUMN "professionalExperience",
DROP COLUMN "skillsAndQualities",
ADD COLUMN     "desiredPositionId" TEXT NOT NULL,
ADD COLUMN     "experienceLevelId" TEXT,
ADD COLUMN     "genderId" TEXT NOT NULL,
ADD COLUMN     "generalAvailabilityId" TEXT,
ADD COLUMN     "highestDegreeId" TEXT NOT NULL,
ADD COLUMN     "maritalStatusId" TEXT,
ALTER COLUMN "birthDate" SET DATA TYPE TEXT,
ALTER COLUMN "availabilityDate" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Specialty";

-- DropTable
DROP TABLE "_ProfessionalSpecialties";

-- DropEnum
DROP TYPE "Gender1";

-- DropEnum
DROP TYPE "MaritalStatus1";

-- DropEnum
DROP TYPE "Position";

-- CreateTable
CREATE TABLE "_JobApplicationToProfessionalExperience" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobApplicationToProfessionalExperience_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JobApplicationToLanguage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobApplicationToLanguage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JobApplicationToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobApplicationToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseToJobApplication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToJobApplication_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JobApplicationToProfessionalExperience_B_index" ON "_JobApplicationToProfessionalExperience"("B");

-- CreateIndex
CREATE INDEX "_JobApplicationToLanguage_B_index" ON "_JobApplicationToLanguage"("B");

-- CreateIndex
CREATE INDEX "_JobApplicationToSkill_B_index" ON "_JobApplicationToSkill"("B");

-- CreateIndex
CREATE INDEX "_CourseToJobApplication_B_index" ON "_CourseToJobApplication"("B");

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_desiredPositionId_fkey" FOREIGN KEY ("desiredPositionId") REFERENCES "DesiredPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_highestDegreeId_fkey" FOREIGN KEY ("highestDegreeId") REFERENCES "HighestDegree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_maritalStatusId_fkey" FOREIGN KEY ("maritalStatusId") REFERENCES "MaritalStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_experienceLevelId_fkey" FOREIGN KEY ("experienceLevelId") REFERENCES "ExperienceLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_generalAvailabilityId_fkey" FOREIGN KEY ("generalAvailabilityId") REFERENCES "GeneralAvailability"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_desiredPositionId_fkey" FOREIGN KEY ("desiredPositionId") REFERENCES "DesiredPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationToProfessionalExperience" ADD CONSTRAINT "_JobApplicationToProfessionalExperience_A_fkey" FOREIGN KEY ("A") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationToProfessionalExperience" ADD CONSTRAINT "_JobApplicationToProfessionalExperience_B_fkey" FOREIGN KEY ("B") REFERENCES "ProfessionalExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationToLanguage" ADD CONSTRAINT "_JobApplicationToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationToLanguage" ADD CONSTRAINT "_JobApplicationToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationToSkill" ADD CONSTRAINT "_JobApplicationToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationToSkill" ADD CONSTRAINT "_JobApplicationToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToJobApplication" ADD CONSTRAINT "_CourseToJobApplication_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToJobApplication" ADD CONSTRAINT "_CourseToJobApplication_B_fkey" FOREIGN KEY ("B") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
