import { Module } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UploadService } from 'src/upload/upload.service';

@Module({
   imports: [PrismaModule],
  controllers: [ProfessionalController],
  providers: [ProfessionalService,UploadService],
})
export class ProfessionalModule {}
