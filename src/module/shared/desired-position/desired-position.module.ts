import { Module } from '@nestjs/common';
import { DesiredPositionService } from './desired-position.service';
import { DesiredPositionController } from './desired-position.controller';

@Module({
  controllers: [DesiredPositionController],
  providers: [DesiredPositionService],
})
export class DesiredPositionModule {}
