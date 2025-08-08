import { Module } from '@nestjs/common';
import { HighestDegreeService } from './highest-degree.service';
import { HighestDegreeController } from './highest-degree.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
    imports:[PrismaModule],
  controllers: [HighestDegreeController],
  providers: [HighestDegreeService],
})
export class HighestDegreeModule {}
