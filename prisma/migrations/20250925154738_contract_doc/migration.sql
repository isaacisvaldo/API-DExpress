-- DropForeignKey
ALTER TABLE "ContractDoc" DROP CONSTRAINT "ContractDoc_contractId_fkey";

-- DropForeignKey
ALTER TABLE "ContractDoc" DROP CONSTRAINT "ContractDoc_documentId_fkey";

-- AddForeignKey
ALTER TABLE "ContractDoc" ADD CONSTRAINT "ContractDoc_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractDoc" ADD CONSTRAINT "ContractDoc_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
