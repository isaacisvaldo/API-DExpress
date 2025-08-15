import { Module } from '@nestjs/common';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [PrismaModule],
  controllers: [AdminUserController],
  providers: [AdminUserService,JwtService],
})
export class AdminModule {}
