import { ApiProperty } from "@nestjs/swagger";
import { ContractStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateContractStatusDto {
  @ApiProperty({
    description: "Novo status do contrato",
    enum: ContractStatus,
    example: ContractStatus.EXPIRED,
  })
  @IsEnum(ContractStatus, {
    message: "O status deve ser um valor válido do enum ContractStatus",
  })
  status: ContractStatus;
}
