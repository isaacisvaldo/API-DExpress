
import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importe ApiProperty

export class CreateFrontendUrlDto {
  @ApiProperty({
    description: 'A URL do frontend a ser registrada',
    example: 'http://minha-aplicacao-frontend.com',
  })
  @IsNotEmpty({ message: 'A URL não pode estar vazia.' }) // Mensagem personalizada para IsNotEmpty
  @IsUrl({}, { message: 'A URL deve ser uma URL válida.' })
  url: string;
}