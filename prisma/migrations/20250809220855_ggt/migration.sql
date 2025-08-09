/*
  Warnings:

  - You are about to drop the `ProfessionalExperience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobApplicationToProfessionalExperience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfessionalExperience" DROP CONSTRAINT "ProfessionalExperience_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "_JobApplicationToProfessionalExperience" DROP CONSTRAINT "_JobApplicationToProfessionalExperience_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobApplicationToProfessionalExperience" DROP CONSTRAINT "_JobApplicationToProfessionalExperience_B_fkey";

-- DropTable
DROP TABLE "ProfessionalExperience";

-- DropTable
DROP TABLE "_JobApplicationToProfessionalExperience";

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "localTrabalho" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "tempo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExperienceToJobApplication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExperienceToJobApplication_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ExperienceToProfessional" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExperienceToProfessional_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ExperienceToJobApplication_B_index" ON "_ExperienceToJobApplication"("B");

-- CreateIndex
CREATE INDEX "_ExperienceToProfessional_B_index" ON "_ExperienceToProfessional"("B");

-- AddForeignKey
ALTER TABLE "_ExperienceToJobApplication" ADD CONSTRAINT "_ExperienceToJobApplication_A_fkey" FOREIGN KEY ("A") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceToJobApplication" ADD CONSTRAINT "_ExperienceToJobApplication_B_fkey" FOREIGN KEY ("B") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceToProfessional" ADD CONSTRAINT "_ExperienceToProfessional_A_fkey" FOREIGN KEY ("A") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceToProfessional" ADD CONSTRAINT "_ExperienceToProfessional_B_fkey" FOREIGN KEY ("B") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
