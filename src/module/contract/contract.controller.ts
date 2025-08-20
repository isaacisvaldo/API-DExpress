import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { FilterContractDto } from './dto/filter-contract.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { Contract, Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

// Define o tipo do contrato com as relações para tipagem no controller
const contractInclude = {
  professional: true,
  individualClient: true,
  companyClient: true,
  package: true,
  desiredPosition: true,
  location: {
    include: {
      city: true,
      district: true,
    },
  },
  contractPackegeProfissional: {
    include: {
      professional: true,
    },
  },
};

type ContractWithRelations = Prisma.ContractGetPayload<{
  include: typeof contractInclude;
}>;

@ApiTags('Contracts')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo contrato' })
  @ApiResponse({ status: 201, description: 'Contrato criado com sucesso.' })
  @ApiBody({ type: CreateContractDto })
  async create(@Body() createContractDto: CreateContractDto): Promise<ContractWithRelations> {
    return this.contractService.create(createContractDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os contratos com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista de contratos paginada e filtrada.' })
  async findAll(@Query() filter: FilterContractDto): Promise<PaginatedDto<ContractWithRelations>> {
    return this.contractService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um contrato pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do contrato', type: String })
  @ApiOkResponse({ description: 'Contrato encontrado.' })
  async findOne(@Param('id') id: string): Promise<ContractWithRelations> {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato', type: String })
  @ApiBody({ type: UpdateContractDto })
  @ApiOkResponse({ description: 'Contrato atualizado com sucesso.' })
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ): Promise<ContractWithRelations> {
    return this.contractService.update(id, updateContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato', type: String })
  @ApiOkResponse({ description: 'Contrato removido com sucesso.' })
  async remove(@Param('id') id: string): Promise<Contract> {
    return this.contractService.remove(id);
  }
}
