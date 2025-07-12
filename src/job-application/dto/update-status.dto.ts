// src/job-application/dto/update-status.dto.ts
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobApplicationStatus } from '../types/types';



export class UpdateJobApplicationStatusDto {
  @ApiProperty({ enum: JobApplicationStatus })
  @IsEnum(JobApplicationStatus)
  status: JobApplicationStatus;
}
