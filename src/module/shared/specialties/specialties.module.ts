// src/specialty/specialty.module.ts
import { Module } from '@nestjs/common';
import { SpecialtyController } from './specialties.controller';
import { SpecialtyService } from './specialties.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';


@Module({
    imports: [PrismaModule],
  controllers: [SpecialtyController],
  providers: [SpecialtyService],
})
export class SpecialtyModule {}