import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ClientCompanyProfileController } from './company.controller';
import { ClientCompanyProfileService } from './company.service';

@Module({
   imports: [PrismaModule],
  controllers: [ClientCompanyProfileController],
  providers: [ClientCompanyProfileService],
})
export class CompanyModule {}
