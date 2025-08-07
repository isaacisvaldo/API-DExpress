import { Module } from '@nestjs/common';
import { HighestDegreeService } from './highest-degree.service';
import { HighestDegreeController } from './highest-degree.controller';

@Module({
  controllers: [HighestDegreeController],
  providers: [HighestDegreeService],
})
export class HighestDegreeModule {}
