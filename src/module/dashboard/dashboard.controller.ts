import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { parseISO, subDays } from 'date-fns';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getDashboardSummary() {
    return await this.dashboardService.getDashboardSummary();
  }

  @Get('growth/clients-profissionals/registrations')
  async getGrowthData(@Query('range') range: string = '30d') {
    const data = await this.dashboardService.getGrowthData(range);

    return {
      success: true,
      data: data.data,
    };
  }


  @Get('companies-by-sector')
  async getCompaniesBySector() {
    // Implemente a chamada para um método do serviço aqui
  }
}