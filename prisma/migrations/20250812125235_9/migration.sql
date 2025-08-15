/*
  Warnings:

  - Added the required column `label` to the `Sector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "City" ALTER COLUMN "isAvailable" SET DEFAULT true;

-- AlterTable
ALTER TABLE "District" ALTER COLUMN "isAvailable" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Sector" ADD COLUMN     "label" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");
