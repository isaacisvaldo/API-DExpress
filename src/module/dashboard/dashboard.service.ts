import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { format, subDays } from 'date-fns';
import { StatusRequest, ContractStatus } from '@prisma/client';
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }
  async getDashboardSummary() {
    const [
      totalProfessionals,
      clientsIndividual,
      clientsEmpresa,
      activeServices,
      canceledRequests,
    ] = await Promise.all([
      this.prisma.professional.count(),
      this.prisma.clientProfile.count(),
      this.prisma.clientCompanyProfile.count(),
      this.prisma.contract.count({
        where: {
          status: ContractStatus.ACTIVE,
        },
      }),
      this.prisma.serviceRequest.count({
        where: {
          status: StatusRequest.REJECTED,
        },
      }),

    ]);
    // O total de clientes é a soma dos dois tipos de perfis
    const totalClients = clientsIndividual + clientsEmpresa;

    const data = {
      totalProfessionals,
      totalClients,
      activeServices,
      canceledRequests,
    };
    return data
  }



  async getGrowthData(range: string = '30d') {
    const days = this.parseRange(range);
    const startDate = subDays(new Date(), days);

    // 1. Buscar todos os profissionais, clientes individuais e empresas no período
    const [
      professionals,
      clientProfiles,
      clientCompanyProfiles,
    ] = await Promise.all([
      this.prisma.professional.findMany({
        where: {
          createdAt: {
            gte: startDate, // Greater than or equal to startDate
          },
        },
        select: {
          createdAt: true, // Select only the creation date
        },
      }),
      this.prisma.clientProfile.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
      this.prisma.clientCompanyProfile.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    // 2. Agrupar e contar os dados por dia
    const dailyData: { [key: string]: { profissionais: number; clientes_fisica: number; clientes_empresa: number } } = {};

    // Inicializar o objeto dailyData para todas as datas no range
    let currentDate = new Date(startDate);
    const endDate = new Date();
    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      dailyData[dateKey] = { profissionais: 0, clientes_fisica: 0, clientes_empresa: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Popular os dados
    professionals.forEach(p => {
      const dateKey = format(p.createdAt, 'yyyy-MM-dd');
      if (dailyData[dateKey]) {
        dailyData[dateKey].profissionais += 1;
      }
    });

    clientProfiles.forEach(cp => {
      const dateKey = format(cp.createdAt, 'yyyy-MM-dd');
      if (dailyData[dateKey]) {
        dailyData[dateKey].clientes_fisica += 1;
      }
    });

    clientCompanyProfiles.forEach(ccp => {
      const dateKey = format(ccp.createdAt, 'yyyy-MM-dd');
      if (dailyData[dateKey]) {
        dailyData[dateKey].clientes_empresa += 1;
      }
    });

    const formattedData = Object.keys(dailyData)
      .sort()
      .map(date => ({
        date: date,
        profissionais: dailyData[date].profissionais,
        clientes_fisica: dailyData[date].clientes_fisica,
        clientes_empresa: dailyData[date].clientes_empresa,
      }));

    return {
      success: true,
      data: formattedData,
    };
  }
  private parseRange(range: string): number {
    if (range.endsWith('d')) {
      return parseInt(range.slice(0, -1), 10);
    }
    return 30;
  }
  async getCompaniesBySector() {
    // 1. Busque todos os perfis de empresas, incluindo o setor relacionado.
    const companyProfiles = await this.prisma.clientCompanyProfile.findMany({
      select: {
        sector: {
          select: {
            label: true,
          },
        },
      },
    });

    const sectorCount: { [key: string]: number } = {};
    companyProfiles.forEach(profile => {
      const sectorLabel = profile.sector?.label;
      if (sectorLabel) {
        sectorCount[sectorLabel] = (sectorCount[sectorLabel] || 0) + 1;
      }
    });

    const formattedData = Object.keys(sectorCount).map(sectorLabel => ({
      sector: sectorLabel,
      companies: sectorCount[sectorLabel],
    }));

    return formattedData;
  }

}
