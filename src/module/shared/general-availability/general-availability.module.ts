import { Module } from '@nestjs/common';
import { GeneralAvailabilityService } from './general-availability.service';
import { GeneralAvailabilityController } from './general-availability.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
    imports:[PrismaModule],
  controllers: [GeneralAvailabilityController],
  providers: [GeneralAvailabilityService],
})
export class GeneralAvailabilityModule {}
