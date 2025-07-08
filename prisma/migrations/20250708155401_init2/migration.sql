/*
  Warnings:

  - You are about to drop the `jobApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "jobApplication";

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "identityNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "optionalPhoneNumber" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "hasChildren" BOOLEAN NOT NULL,
    "knownDiseases" TEXT,
    "desiredPosition" TEXT NOT NULL,
    "languages" TEXT[],
    "availabilityDate" TIMESTAMP(3) NOT NULL,
    "professionalExperience" TEXT NOT NULL,
    "highestDegree" TEXT NOT NULL,
    "courses" TEXT[],
    "skillsAndQualities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
