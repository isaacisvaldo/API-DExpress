import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
    imports:[PrismaModule],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}
