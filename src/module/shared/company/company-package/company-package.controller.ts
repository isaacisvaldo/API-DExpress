import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompanyPackageService } from './company-package.service';
import { CreateCompanyPackageDto } from './dto/create-company-package.dto';
import { UpdateCompanyPackageDto } from './dto/update-company-package.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { CompanyPackage } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Company Packages')
@Controller('company-packages')
export class CompanyPackageController {
  constructor(private readonly companyPackageService: CompanyPackageService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo contrato de pacote de serviço para uma empresa' })
  @ApiResponse({ status: 201, description: 'Contrato de pacote criado com sucesso.' })
  create(@Body() createCompanyPackageDto: CreateCompanyPackageDto) {
    return this.companyPackageService.create(createCompanyPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os contratos de pacotes de empresas com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista paginada de contratos de pacotes.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<CompanyPackage>> {
    return this.companyPackageService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um contrato de pacote pelo ID' })
  @ApiOkResponse({ description: 'Contrato de pacote encontrado.' })
  findOne(@Param('id') id: string) {
    return this.companyPackageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um contrato de pacote' })
  @ApiOkResponse({ description: 'Contrato de pacote atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateCompanyPackageDto: UpdateCompanyPackageDto) {
    return this.companyPackageService.update(id, updateCompanyPackageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um contrato de pacote' })
  @ApiOkResponse({ description: 'Contrato de pacote removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.companyPackageService.remove(id);
  }
}