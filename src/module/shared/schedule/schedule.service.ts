import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 0 * * *')
  async handleContractExpiration() {
    const now = new Date();

    const result = await this.prisma.contract.updateMany({
      where: {
        endDate: { lte: now },
        status: 'ACTIVE',
      },
      data: {
        status: 'EXPIRED',
      },
    });

    this.logger.log(
      `Contracts automatically updated to expired: ${result.count}`,
    );
  }
}
