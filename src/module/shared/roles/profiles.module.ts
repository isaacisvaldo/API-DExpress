import { Module } from '@nestjs/common';

import { ProfilesController } from './profiles.controller';
import { ProfileService } from './profiles.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports :[PrismaModule],
  controllers: [ProfilesController],
  providers: [ProfileService],
})
export class ProfilesModule {}
