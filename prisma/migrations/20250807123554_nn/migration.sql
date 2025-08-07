/*
  Warnings:

  - Changed the type of `name` on the `Sector` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Sector" DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropEnum
DROP TYPE "SectorType";

-- CreateIndex
CREATE UNIQUE INDEX "Sector_name_key" ON "Sector"("name");
