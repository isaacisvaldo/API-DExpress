import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidEmail } from 'src/common/validators/is-valid-email';

export class CreateNewsletterSubscriberDto {
 @ApiProperty({ example: 'isaacisvaldobunga300@gmail.com' })
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  @IsValidEmail() 
  email: string;
}