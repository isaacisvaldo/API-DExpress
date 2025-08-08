import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsString } from 'class-validator';

/**
 * DTO genérico para parâmetros de paginação e pesquisa.
 * Use este DTO para `@Query()` nos seus controladores.
 */
export class FindAllDto {
  @ApiProperty({
    description: 'O número da página a ser retornada. Inicia em 1.',
    example: 1,
    required: false,
    default: 1
  })
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @ApiProperty({
    description: 'O número de itens por página.',
    example: 10,
    required: false,
    default: 10
  })
  @IsOptional()
  @IsNumberString()
  pageSize?: string = '10';

  @ApiProperty({
    description: 'Termo de pesquisa para filtrar os resultados.',
    example: 'primeiros socorros',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;
}
