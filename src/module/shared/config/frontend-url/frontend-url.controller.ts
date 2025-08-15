// src/frontend-url/frontend-url.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FrontendUrlService } from './frontend-url.service';
import { CreateFrontendUrlDto } from './dto/create-frontend-url.dto';
import { UpdateFrontendUrlDto } from './dto/update-frontend-url.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger'; 

@ApiTags('frontend-urls') // Agrupa os endpoints sob a tag 'frontend-urls' no Swagger UI
@Controller('frontend-urls')
export class FrontendUrlController {
  constructor(private readonly frontendUrlService: FrontendUrlService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova URL de frontend' }) // Descrição da operação
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'A URL foi criada com sucesso.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Requisição inválida.' })
  @ApiBody({ type: CreateFrontendUrlDto })
  create(@Body() createFrontendUrlDto: CreateFrontendUrlDto) {

    console.log(createFrontendUrlDto);
    
    return this.frontendUrlService.create(createFrontendUrlDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtém todas as URLs de frontend' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de URLs retornada com sucesso.' })
  findAll() {
    return this.frontendUrlService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma URL de frontend pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da URL', example: 'algum-id-uuid' }) // Documenta o parâmetro de rota
  @ApiResponse({ status: HttpStatus.OK, description: 'URL encontrada com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'URL não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.frontendUrlService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma URL de frontend existente' })
  @ApiParam({ name: 'id', description: 'ID da URL para atualizar', example: 'algum-id-uuid' })
  @ApiBody({ type: UpdateFrontendUrlDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'URL atualizada com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'URL não encontrada.' })
  update(
    @Param('id') id: string,
    @Body() updateFrontendUrlDto: UpdateFrontendUrlDto,
  ) {
    return this.frontendUrlService.update(id, updateFrontendUrlDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma URL de frontend' })
  @ApiParam({ name: 'id', description: 'ID da URL para remover', example: 'algum-id-uuid' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'URL removida com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'URL não encontrada.' })
  remove(@Param('id') id: string) {
    return this.frontendUrlService.remove(id);
  }
}