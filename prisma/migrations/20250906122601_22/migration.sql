-- DropForeignKey
ALTER TABLE "ContractPackegeProfissional" DROP CONSTRAINT "ContractPackegeProfissional_contractId_fkey";

-- AddForeignKey
ALTER TABLE "ContractPackegeProfissional" ADD CONSTRAINT "ContractPackegeProfissional_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
