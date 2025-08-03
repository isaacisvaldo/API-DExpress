-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('IDENTITY_DOCUMENT', 'CRIMINAL_RECORD', 'TRAINING_CERTIFICATE', 'MEDICAL_CERTIFICATE', 'PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "GeneralAvailability" AS ENUM ('FULL_TIME', 'PART_TIME', 'DAILY', 'WEEKENDS', 'ANY');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('LESS_THAN_1', 'ONE_TO_THREE', 'THREE_TO_FIVE', 'MORE_THAN_FIVE');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CLIENT', 'COMPANY');

-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'STABLE_UNION');

-- CreateEnum
CREATE TYPE "DesiredPosition" AS ENUM ('BABYSITTER', 'HOUSEKEEPER', 'COOK', 'CAREGIVER', 'GARDENER', 'IRONING', 'CLEANING_ASSISTANT', 'OTHER');

-- CreateEnum
CREATE TYPE "InternalRole" AS ENUM ('GENERAL_ADMIN', 'OPERATIONS_MANAGER', 'HR_COORDINATOR', 'QUALITY_SUPERVISOR', 'CUSTOMER_ASSISTANT', 'FINANCIAL', 'INTERNAL_AUDITOR');

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "identityNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "optionalPhoneNumber" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
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
    "identityNumber" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "availabilityType" "GeneralAvailability" NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "jobApplicationId" TEXT,
    "description" TEXT,
    "expectedAvailability" TIMESTAMP(3),
    "hasCriminalRecord" BOOLEAN NOT NULL DEFAULT false,
    "hasMedicalCertificate" BOOLEAN NOT NULL DEFAULT false,
    "hasTrainingCertificate" BOOLEAN NOT NULL DEFAULT false,
    "hasPhoto" BOOLEAN NOT NULL DEFAULT false,
    "locationId" TEXT NOT NULL,
    "profileImage" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
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
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "identityNumber" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "optionalContacts" TEXT[],
    "address" TEXT NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "optionalContact" TEXT,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" "UserType" NOT NULL DEFAULT 'CLIENT',
    "clientProfileId" TEXT,
    "companyProfileId" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numberphone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "identityNumber" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "InternalRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "plan" TEXT NOT NULL DEFAULT 'Free',
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AccountSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecuritySettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginNotifications" BOOLEAN NOT NULL DEFAULT true,
    "lastPasswordChange" TIMESTAMP(3),

    CONSTRAINT "SecuritySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" BOOLEAN NOT NULL DEFAULT true,
    "push" BOOLEAN NOT NULL DEFAULT false,
    "marketing" BOOLEAN NOT NULL DEFAULT true,
    "weekly" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfessionalSpecialties" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfessionalSpecialties_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AdminPermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminPermissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professional_email_key" ON "Professional"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_jobApplicationId_key" ON "Professional"("jobApplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_cityId_key" ON "District"("name", "cityId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_email_key" ON "ClientProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_email_key" ON "CompanyProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientProfileId_key" ON "User"("clientProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyProfileId_key" ON "User"("companyProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_identityNumber_key" ON "AdminUser"("identityNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccountSettings_userId_key" ON "AccountSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SecuritySettings_userId_key" ON "SecuritySettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "_ProfessionalSpecialties_B_index" ON "_ProfessionalSpecialties"("B");

-- CreateIndex
CREATE INDEX "_AdminPermissions_B_index" ON "_AdminPermissions"("B");

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "JobApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalExperience" ADD CONSTRAINT "ProfessionalExperience_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "User" ADD CONSTRAINT "User_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountSettings" ADD CONSTRAINT "AccountSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecuritySettings" ADD CONSTRAINT "SecuritySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalSpecialties" ADD CONSTRAINT "_ProfessionalSpecialties_A_fkey" FOREIGN KEY ("A") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalSpecialties" ADD CONSTRAINT "_ProfessionalSpecialties_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminPermissions" ADD CONSTRAINT "_AdminPermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminPermissions" ADD CONSTRAINT "_AdminPermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
