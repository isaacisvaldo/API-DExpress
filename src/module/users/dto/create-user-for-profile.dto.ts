// src/user/dto/create-user-for-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum } from 'class-validator';
import { UserType } from '@prisma/client';

export class CreateUserForProfileDto {
  @ApiProperty({ example: 'uuid-do-perfil' })
  @IsUUID()
  profileId: string;

  @ApiProperty({ enum: UserType, example: UserType.CLIENT })
  @IsEnum(UserType)
  type: UserType;
}
