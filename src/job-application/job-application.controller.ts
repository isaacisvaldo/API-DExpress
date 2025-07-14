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
  ApiBody
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
  create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    return this.jobApplicationService.create(createJobApplicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all job applications' })
  @ApiResponse({
    status: 200,
    description: 'List of job applications',
  })
@Get()
@ApiOperation({ summary: 'Listar candidaturas com filtros e paginação' })
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
 /*
  @Patch(':id')
  @ApiOperation({ summary: 'Update a job application by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Job application updated successfully',
  })
 
  update(
    @Param('id') id: string,
    @Body() updateJobApplicationDto: UpdateJobApplicationDto,
  ) {
    return this.jobApplicationService.update(id, updateJobApplicationDto);
  }
*/
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
@ApiBody({ type: UpdateJobApplicationStatusDto }) 
@ApiOperation({ summary: 'Update a Status application by ID' })
updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateJobApplicationStatusDto,
) {
  return this.jobApplicationService.updateStatus(id, dto);
}
}
