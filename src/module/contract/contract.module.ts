import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ContractNumberHelper } from 'src/helpers/contract-number.helper';

@Module({
  imports:[PrismaModule],
  controllers: [ContractController],
  providers: [ContractService,ContractNumberHelper],
})
export class ContractModule {}
