// src/professional/dto/filter-professional.dto.ts
import { IsOptional, IsUUID, IsString } from 'class-validator';

export class FilterProfessionalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  cityId?: string;

  @IsOptional()
  @IsUUID()
  districtId?: string;
}
