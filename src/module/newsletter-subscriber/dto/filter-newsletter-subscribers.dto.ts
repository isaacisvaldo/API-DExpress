import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FilterNewsletterSubscribersDto {
  @IsOptional()
  @IsString()
    @ApiPropertyOptional({ description: 'Filtra por e-mail' })
    search?: string;
    @ApiPropertyOptional({ description: 'Número da página', minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;
  
    @ApiPropertyOptional({ description: 'Limite de resultados por página', minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;
}