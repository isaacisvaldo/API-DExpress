// src/dto/filter-service-requests.dto.ts

import { IsOptional, IsString, IsEnum, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { StatusRequest, UserType } from '@prisma/client';

class FilterParams {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit?: number;
}

export class FilterServiceRequestsDto extends FilterParams {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserType)
  requesterType?: UserType;

  @IsOptional()
  @IsEnum(StatusRequest)
  status?: StatusRequest;

  @IsOptional()
  @IsString()
  description?: string;
}