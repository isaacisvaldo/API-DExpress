import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersService } from './users.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [PrismaModule, MailerModule],
  controllers: [UsersController],
  providers: [UsersService], 
  exports: [UsersService], 
})
export class UsersModule {}
