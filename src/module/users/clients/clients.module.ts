import { Module } from '@nestjs/common';
import { ClientProfileController } from './clients.controller';
import { ClientProfileService } from './clients.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';


@Module({
   imports: [PrismaModule],
  controllers: [ClientProfileController],
  providers: [ClientProfileService],
})
export class ClientsModule {}
