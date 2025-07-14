-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'STABLE_UNION');

-- CreateEnum
CREATE TYPE "DesiredPosition" AS ENUM ('BABYSITTER', 'HOUSEKEEPER', 'COOK', 'CAREGIVER', 'GARDENER', 'IRONING', 'CLEANING_ASSISTANT', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('IDENTITY_DOCUMENT', 'CRIMINAL_RECORD', 'TRAINING_CERTIFICATE', 'MEDICAL_CERTIFICATE', 'PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "GeneralAvailability" AS ENUM ('FULL_TIME', 'PART_TIME', 'DAILY', 'WEEKENDS', 'ANY');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('LESS_THAN_1', 'ONE_TO_THREE', 'THREE_TO_FIVE', 'MORE_THAN_FIVE');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "identityNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "optionalPhoneNumber" TEXT,
    "email" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "hasChildren" BOOLEAN NOT NULL,
    "knownDiseases" TEXT,
    "desiredPosition" "DesiredPosition" NOT NULL,
    "languages" TEXT[],
    "availabilityDate" TIMESTAMP(3) NOT NULL,
    "professionalExperience" TEXT NOT NULL,
    "highestDegree" TEXT NOT NULL,
    "courses" TEXT[],
    "skillsAndQualities" TEXT[],
    "status" "JobApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "availabilityType" "GeneralAvailability" NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "locationId" TEXT NOT NULL,
    "profileImage" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maritalStatus" TEXT NOT NULL DEFAULT 'Não informado',
    "hasChildren" BOOLEAN NOT NULL DEFAULT false,
    "knownDiseases" TEXT,
    "desiredPosition" "DesiredPosition" NOT NULL DEFAULT 'HOUSEKEEPER',
    "expectedSalary" INTEGER NOT NULL DEFAULT 0,
    "highestDegree" TEXT NOT NULL DEFAULT 'Não informado',
    "courses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skillsAndQualities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "street" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfessionalSpecialties" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfessionalSpecialties_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professional_email_key" ON "Professional"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_cityId_key" ON "District"("name", "cityId");

-- CreateIndex
CREATE INDEX "_ProfessionalSpecialties_B_index" ON "_ProfessionalSpecialties"("B");

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalSpecialties" ADD CONSTRAINT "_ProfessionalSpecialties_A_fkey" FOREIGN KEY ("A") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalSpecialties" ADD CONSTRAINT "_ProfessionalSpecialties_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
