-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "label" TEXT;
