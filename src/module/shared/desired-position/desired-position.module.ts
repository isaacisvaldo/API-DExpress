import { Module } from '@nestjs/common';
import { DesiredPositionService } from './desired-position.service';
import { DesiredPositionController } from './desired-position.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
    imports:[PrismaModule],
  controllers: [DesiredPositionController],
  providers: [DesiredPositionService],
})
export class DesiredPositionModule {}
