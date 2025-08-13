import { Module } from '@nestjs/common';
import { CompanyPackageService } from './company-package.service';
import { CompanyPackageController } from './company-package.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [CompanyPackageController],
  providers: [CompanyPackageService],
})
export class CompanyPackageModule {}
