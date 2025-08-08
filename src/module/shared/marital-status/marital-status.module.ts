import { Module } from '@nestjs/common';
import { MaritalStatusService } from './marital-status.service';
import { MaritalStatusController } from './marital-status.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
    imports:[PrismaModule],
  controllers: [MaritalStatusController],
  providers: [MaritalStatusService],
})
export class MaritalStatusModule {}
