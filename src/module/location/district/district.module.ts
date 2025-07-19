import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
   imports: [PrismaModule],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
