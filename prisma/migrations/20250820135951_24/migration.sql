-- CreateTable
CREATE TABLE "ContractPackegeProfissional" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContractPackegeProfissional_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractPackegeProfissional" ADD CONSTRAINT "ContractPackegeProfissional_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractPackegeProfissional" ADD CONSTRAINT "ContractPackegeProfissional_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
