import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 'f42c0e8a-1b3e-4f3d-b3a2-8c5a3b91cbe9' })
  @IsUUID()
  cityId: string;

  @ApiProperty({ example: 'a76ef8b4-3c28-4f7d-b1b0-0e367d3f54f4' })
  @IsUUID()
  districtId: string;

  @ApiPropertyOptional({ example: 'Rua 17 de Setembro, nº 102' })
  @IsOptional()
  @IsString()
  street?: string;
}
