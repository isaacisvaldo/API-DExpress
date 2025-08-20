import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { Package } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Packages')
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pacote de serviço' })
  @ApiResponse({ status: 201, description: 'Pacote criado com sucesso.' })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pacotes com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de pacotes paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Package>> {
    return this.packageService.findAll(query);
  }

  @Get('list')
  @ApiOperation({ summary: 'Lista todos os pacotes para uso em formulários' })
  @ApiOkResponse({ description: 'Lista completa de todos os pacotes.' })
  findAllForFrontend(): Promise<Package[]> {
    return this.packageService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um pacote pelo ID' })
  @ApiOkResponse({ description: 'Pacote encontrado.' })
  findOne(@Param('id') id: string) {
    // O id do Prisma é um string (UUID)
    return this.packageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um pacote' })
  @ApiOkResponse({ description: 'Pacote atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um pacote' })
  @ApiOkResponse({ description: 'Pacote removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.packageService.remove(id);
  }
}