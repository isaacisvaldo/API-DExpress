import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { TemplateContractController } from './template.contract.controller';
import { TemplateContractService } from './template-contract.service';

@Module({
  imports: [PrismaModule],
  controllers: [TemplateContractController],
  providers: [TemplateContractService],
})
export class TemplateContractModule {}
