import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationStatusDto } from './dto/update-status.dto';
import { FilterJobApplicationDto } from './dto/filter-job-application.dto';

@ApiTags('Job Applications')
@Controller('job-application')
export class JobApplicationController {
  constructor(
    private readonly jobApplicationService: JobApplicationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new job application' })
  @ApiResponse({
    status: 201,
    description: 'Job application successfully created',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    const data = await this.jobApplicationService.create(createJobApplicationDto);
    return { message: 'Candidatura recebida com sucesso!', data };
  }

  @Get()
  @ApiOperation({ summary: 'List job applications with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of job applications',
  })
  async findAll(@Query() query: FilterJobApplicationDto) {
    return this.jobApplicationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job application by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Job application details',
  })
  findOne(@Param('id') id: string) {
    return this.jobApplicationService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job application by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Job application removed successfully',
  })
  remove(@Param('id') id: string) {
    return this.jobApplicationService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of a job application by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateJobApplicationStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateJobApplicationStatusDto,
  ) {
    return this.jobApplicationService.updateStatus(id, dto);
  }

  @Get(':id/has-profile')
  @ApiOperation({ summary: 'Check if a job application has an associated profile' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns true if the job application has a profile, false otherwise',
  })
  async checkHasProfile(@Param('id') id: string) {
    const hasProfile = await this.jobApplicationService.checkHasProfile(id);
    return {
      hasProfile: hasProfile,
      message: hasProfile
        ? 'Profile exists for this job application.'
        : 'No profile found for this job application.',
    };
  }
}