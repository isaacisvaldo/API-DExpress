-- CreateTable
CREATE TABLE "jobApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "identityNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "optionalPhoneNumber" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "location" TEXT NOT NULL,
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

    CONSTRAINT "jobApplication_pkey" PRIMARY KEY ("id")
);
