import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobApplicationStatus } from '../types/types';

export class UpdateJobApplicationStatusDto {
  @ApiPropertyOptional({
    enum: JobApplicationStatus,
    example: JobApplicationStatus.PENDING,
    default: JobApplicationStatus.PENDING,
    description: 'Selecione o novo status da candidatura',
  })
  @IsOptional()
  @IsEnum(JobApplicationStatus)
  status: JobApplicationStatus = JobApplicationStatus.PENDING;
}
