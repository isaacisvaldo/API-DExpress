import { Module } from '@nestjs/common';
import { ExperienceLevelService } from './experience-level.service';
import { ExperienceLevelController } from './experience-level.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
    imports:[PrismaModule],
  controllers: [ExperienceLevelController],
  providers: [ExperienceLevelService],
})
export class ExperienceLevelModule {}
