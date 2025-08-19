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
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { ServiceRequest } from '@prisma/client';
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { FilterServiceRequestsDto } from './dto/filter-service-requests.dto';

@ApiTags('Service Requests')
@Controller('service-requests')
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova solicitação de serviço.' })
  @ApiResponse({
    status: 201,
    description: 'Solicitação criada com sucesso e e-mail de confirmação enviado.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou e-mail já cadastrado.' })
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestService.create(createServiceRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as solicitações de serviço com paginação e pesquisa.' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de solicitações paginada.' })
  findAll(@Query() query: FilterServiceRequestsDto): Promise<PaginatedDto<ServiceRequest>> {
    
    return this.serviceRequestService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma solicitação de serviço pelo ID.' })
  @ApiOkResponse({ description: 'Solicitação encontrada.' })
  @ApiResponse({ status: 404, description: 'Solicitação não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.serviceRequestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma solicitação de serviço.' })
  @ApiOkResponse({ description: 'Solicitação atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Solicitação não encontrada.' })
  update(@Param('id') id: string, @Body() updateServiceRequestDto: UpdateServiceRequestDto) {
    return this.serviceRequestService.update(id, updateServiceRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma solicitação de serviço.' })
  @ApiOkResponse({ description: 'Solicitação removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Solicitação não encontrada.' })
  remove(@Param('id') id: string) {
    return this.serviceRequestService.remove(id);
  }
}