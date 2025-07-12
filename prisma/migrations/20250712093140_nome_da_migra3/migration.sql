-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DesiredPosition" AS ENUM ('BABYSITTER', 'HOUSEKEEPER', 'COOK', 'CAREGIVER', 'GARDENER', 'IRONING', 'CLEANING_ASSISTANT', 'OTHER');

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "status" "JobApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "courses" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "desiredPosition" "DesiredPosition" NOT NULL DEFAULT 'HOUSEKEEPER',
ADD COLUMN     "expectedSalary" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hasChildren" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "highestDegree" TEXT NOT NULL DEFAULT 'Não informado',
ADD COLUMN     "knownDiseases" TEXT,
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maritalStatus" TEXT NOT NULL DEFAULT 'Não informado',
ADD COLUMN     "skillsAndQualities" TEXT[] DEFAULT ARRAY[]::TEXT[];
