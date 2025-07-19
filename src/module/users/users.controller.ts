import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserForProfileDto } from './dto/create-user-for-profile.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Cria usuário vinculado a um perfil (cliente ou empresa)' })
  createUser(@Body() dto: CreateUserForProfileDto) {
    return this.usersService.createUserForProfile(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  findAll() {
    return this.usersService.findAll();
  }
}
