-- AlterEnum
ALTER TYPE "ContractStatus" ADD VALUE 'CANCELED';

-- CreateTable
CREATE TABLE "contractSequence" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contractSequence_pkey" PRIMARY KEY ("id")
);
