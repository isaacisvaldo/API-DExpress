import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter-subscriber.service';
import { NewsletterController } from './newsletter-subscriber.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
    imports:[PrismaModule],
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterSubscriberModule {}
