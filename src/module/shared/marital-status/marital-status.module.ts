import { Module } from '@nestjs/common';
import { MaritalStatusService } from './marital-status.service';
import { MaritalStatusController } from './marital-status.controller';

@Module({
  controllers: [MaritalStatusController],
  providers: [MaritalStatusService],
})
export class MaritalStatusModule {}
