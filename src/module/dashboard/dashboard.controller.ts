import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { parseISO, subDays } from 'date-fns';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

 @Get('summary')
  async getDashboardSummary() {
    return  await this.dashboardService.getDashboardSummary();
  }

    @Get('growth/clients-profissionals/registrations')
  async getGrowthData(@Query('range') range: string = '30d') {
    const days = this.parseRange(range);
    const startDate = subDays(new Date(), days);
    console.log(range);
    

    const filtered = chartDataStatic.filter((item) => {
      const date = parseISO(item.date);
      return date >= startDate;
    });

    return {
      success: true,
      data: filtered,
    };
  }

  private parseRange(range: string): number {
    const match = range.match(/^(\d+)[dD]$/);
    return match ? parseInt(match[1], 10) : 30;
  }


  @Get('companies-by-sector')
  async getCompaniesBySector() {
   
  }
}


const chartDataStatic = [

  // Adicione dados para 2025 para que a query de 90 dias funcione
{ date: "2025-05-09", profissionais: 50, clientes: 40 },
{ date: "2025-05-10", profissionais: 55, clientes: 45 },
// ... adicione mais datas aqui
{ date: "2025-08-06", profissionais: 60, clientes: 50 },
{ date: "2025-08-07", profissionais: 65, clientes: 55 },
];



