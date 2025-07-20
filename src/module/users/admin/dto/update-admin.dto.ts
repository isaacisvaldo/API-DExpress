import { PartialType } from '@nestjs/swagger';
import { CreateAdminUserDto } from './create-admin-user.dto.ts';

export class UpdateAdminDto extends PartialType(CreateAdminUserDto) {}
