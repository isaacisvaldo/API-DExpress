import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateDocDto {
  @ApiProperty({ description: 'Nome do documento', example: 'Termos de Serviço' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descrição do documento', example: 'Documento que detalha os termos e condições de uso.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'URL do documento', example: 'https://example.com/termos-de-servico.pdf' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
