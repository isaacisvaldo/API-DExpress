import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { FilterContractDto } from './dto/filter-contract.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { Contract, ContractStatus, Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateContractStatusDto } from './dto/UpdateContractStatusDto';
import { CreateDocDto } from 'src/docs/dto/create-docs-dto';

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
   private readonly statusLabels: Record<ContractStatus, string> = {
   [ContractStatus.DRAFT]: "Rascunho",
   [ContractStatus.PENDING_SIGNATURE]: "Pendente de assinatura",
   [ContractStatus.EXPIRED]: "Expirado",
   [ContractStatus.ACTIVE]: "Ativo",
   [ContractStatus.TERMINATED]: "Terminado",
   [ContractStatus.CANCELED]: "Cancelado",
   [ContractStatus.PAUSED]: "Pausado",
   [ContractStatus.COMPLETED]: "Completo",
  
  
 };

  @Get("statuses")
  @ApiOperation({ summary: "Lista todos os status possíveis de contrato com rótulos" })
  @ApiOkResponse({
    description: "Lista de status do contrato com value e label",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          value: { type: "string" },
          label: { type: "string" },
        },
      },
    },
  })
  getStatuses(): { value: string; label: string }[] {
    return Object.values(ContractStatus).map((status) => ({
      value: status,
      label: this.statusLabels[status],
    }));
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo contrato' })
  @ApiResponse({ status: 201, description: 'Contrato criado com sucesso.' })
  @ApiBody({ type: CreateContractDto })
  async create(@Body() createContractDto: CreateContractDto): Promise<ContractWithRelations> {
    return this.contractService.create(createContractDto);
  }
  @Post(':id/documents')
  @ApiOperation({ summary: 'Cria um novo documento para um contrato' })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso.' })
createContractDoc(
    @Param('id') id: string,
    @Body() dto: CreateDocDto,
  ) {
    return this.contractService.createContractDoc(id, dto);
  }



  @Get()
  @ApiOperation({ summary: 'Lista todos os contratos com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista de contratos paginada e filtrada.' })
  async findAll(@Query() filter: FilterContractDto): Promise<PaginatedDto<ContractWithRelations>> {
    return this.contractService.findAll(filter);
  }
  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualiza o status de um Contrato de serviço.' })
  @ApiResponse({
    status: 200,
    description: 'Status do Contrato atualizado com sucesso.',
  })
UpdateStatus(
    @Param('id') id: string,
    @Body('status') status: ContractStatus,
  ) {
    return this.contractService.updateStatus(id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um contrato pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do contrato', type: String })
  @ApiOkResponse({ description: 'Contrato encontrado.' })
  async findOne(@Param('id') id: string): Promise<ContractWithRelations> {
    return this.contractService.findOne(id);
  }
  @Patch(":id/status")
  @ApiOperation({ summary: "Atualiza o status de um contrato" })
  @ApiParam({ name: "id", description: "ID do contrato", type: String })
  @ApiBody({
    description: "Novo status do contrato",
    type: UpdateContractStatusDto,
    examples: {
      exemplo: {
        value: { status: "EXPIRED" }, 
      },
    },
  })
  @ApiOkResponse({ description: "Contrato atualizado com sucesso." })
  async updateStatus(
    @Param("id") id: string,
    @Body() body: UpdateContractStatusDto
  ) {
    return this.contractService.updateContractStatus(id, body.status);
  }

  
  @Put(':id')
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
