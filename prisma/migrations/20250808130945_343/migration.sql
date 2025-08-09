/*
  Warnings:

  - You are about to drop the column `role` on the `AdminUser` table. All the data in the column will be lost.
  - You are about to drop the `_AdminPermissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `AdminUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `AdminUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdminUser" DROP CONSTRAINT "AdminUser_genderId_fkey";

-- DropForeignKey
ALTER TABLE "_AdminPermissions" DROP CONSTRAINT "_AdminPermissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminPermissions" DROP CONSTRAINT "_AdminPermissions_B_fkey";

-- AlterTable
ALTER TABLE "AdminUser" DROP COLUMN "role",
ADD COLUMN     "profileId" TEXT NOT NULL,
ALTER COLUMN "genderId" DROP NOT NULL;

-- DropTable
DROP TABLE "_AdminPermissions";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfilePermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfilePermissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_name_key" ON "Profile"("name");

-- CreateIndex
CREATE INDEX "_ProfilePermissions_B_index" ON "_ProfilePermissions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_profileId_key" ON "AdminUser"("profileId");

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfilePermissions" ADD CONSTRAINT "_ProfilePermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfilePermissions" ADD CONSTRAINT "_ProfilePermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
