import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SendEmailDto {
  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'Destinatário do e-mail',
  })
  @IsEmail()
  to: string

  @ApiPropertyOptional({
    example: 'Assunto do e-mail',
    description: 'Assunto do e-mail. Caso não seja informado, será usado um valor padrão.',
  })
  @IsOptional()
  @IsString()
  subject?: string

  @ApiProperty({
    example: '<p>Olá, esta é uma mensagem.</p>',
    description: 'Conteúdo HTML do e-mail',
  })
  @IsNotEmpty()
  @IsString()
  html: string
}
