import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/common/prisma/prisma.module';

import { MailerModule } from '@nestjs-modules/mailer';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [PrismaModule, MailerModule],
  controllers: [UserController],
  providers: [UserService], 
  
})
export class UsersModule {}
