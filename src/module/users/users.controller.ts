import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { UserService } from './users.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário sem associar a um perfil na criação.' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso e senha temporária enviada por e-mail.',
  })
  @ApiResponse({ status: 400, description: 'E-mail já cadastrado.' })
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const originDomain = req.headers['origin'];
    return this.userService.create(createUserDto, originDomain);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de usuários paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<User>> {
    return this.userService.findAll(query);
  }
  @Get('without-profile')
  @ApiOperation({ summary: 'Lista todos os usuários que não têm nenhum perfil associado, com paginação e pesquisa.' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de usuários sem perfil paginada.' })
  findWithoutProfile(@Query() query: FindAllDto): Promise<PaginatedDto<User>> {
    return this.userService.findUsersWithoutProfile(query);
  }
  @Get('curent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtém os detalhes do usuário autenticado.' })
  @ApiOkResponse({ description: 'Detalhes do usuário autenticado.' })
  getCurrentUser(@Req() req: any) {
    const user = req.user;
    console.log('user', user);
    
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    const Id = user.sub || user.id;
    if (!Id) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
/*
    if (!user.isActive) {
      throw new ForbiddenException('Usuário inativo');
    }
*/
    return this.userService.findOne(Id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  @ApiOkResponse({ description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um usuário' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'E-mail já cadastrado por outro usuário.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativa um usuário' })
  @ApiOkResponse({ description: 'Usuário desativado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  deactivate(@Param('id') id: string) {
    return this.userService.deactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário' })
  @ApiOkResponse({ description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }


}


