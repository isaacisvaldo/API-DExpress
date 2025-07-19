import { Module } from '@nestjs/common';
import { CompanyProfileController } from './company.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CompanyProfileService } from './company.service';


@Module({
   imports: [PrismaModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
})
export class CompanyModule {}
