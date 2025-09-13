import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
} from 'class-validator';
import { UserType } from '@prisma/client';
import { IsValidEmail } from 'src/common/validators/is-valid-email';

export class CreateUserDto {
  @ApiProperty({
    description: 'O primeiro nome do usuário.',
    example: 'João',
  })
  @IsNotEmpty({ message: 'O primeiro nome é obrigatório.' })
  @IsString({ message: 'O primeiro nome deve ser uma string.' })
  firstName: string;

  @ApiProperty({
    description: 'O sobrenome do usuário.',
    example: 'Silva',
  })
  @IsNotEmpty({ message: 'O sobrenome é obrigatório.' })
  @IsString({ message: 'O sobrenome deve ser uma string.' })
  lastName: string;

  @ApiProperty({
    description: 'O endereço de e-mail do usuário. Deve ser único.',
    example: 'joao.silva@example.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsValidEmail() 
  email: string;

  @ApiProperty({
    description: 'O tipo de usuário, CLIENT ou COMPANY.',
    enum: UserType,
    example: UserType.INDIVIDUAL,
  })
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório.' })
  @IsEnum(UserType, { message: 'Tipo de usuário inválido.' })
  type: UserType;
}