import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';


@Injectable()
export class DashboardService {
   constructor(private readonly prisma: PrismaService) {}
async getDashboardSummary() {
const totalProfessionals = await this.prisma.professional.count()

      const data = {
      totalProfessionals,
      totalClients: 3,
      activeServices: 0,
      canceledRequests: 0,
    };
    return data
  }


}
