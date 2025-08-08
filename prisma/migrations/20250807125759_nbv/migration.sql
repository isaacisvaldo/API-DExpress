/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ExperienceLevel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `GeneralAvailability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExperienceLevel_name_key" ON "ExperienceLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralAvailability_name_key" ON "GeneralAvailability"("name");
