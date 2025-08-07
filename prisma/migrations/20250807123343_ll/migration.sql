/*
  Warnings:

  - You are about to drop the `CompanySector` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyProfile" DROP CONSTRAINT "CompanyProfile_sectorId_fkey";

-- DropTable
DROP TABLE "CompanySector";

-- CreateTable
CREATE TABLE "Sector" (
    "id" TEXT NOT NULL,
    "name" "SectorType" NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sector_name_key" ON "Sector"("name");

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
