import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  imports: [NestScheduleModule.forRoot()],
  providers: [ScheduleService, PrismaService],
})
export class ScheduleModule {}
