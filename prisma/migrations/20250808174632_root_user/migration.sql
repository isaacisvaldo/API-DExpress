-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "isRoot" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "InternalRole";
