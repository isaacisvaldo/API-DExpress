import { Controller, Get,Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';


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
 
    const data = await this.dashboardService.getCompaniesBySector();


    return {
      success: true,
      data: data,
    };
  }
}