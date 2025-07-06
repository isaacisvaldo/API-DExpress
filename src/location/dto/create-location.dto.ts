import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsUUID()
  cityId: string;

  @IsUUID()
  districtId: string;

  @IsOptional()
  @IsString()
  street?: string;
}