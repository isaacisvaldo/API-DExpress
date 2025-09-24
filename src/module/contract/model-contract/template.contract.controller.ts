import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ContractTemplateDto } from './dto/contract-template.dto';
import { UpdateContractTemplateDto } from './dto/update-contract-template.dto';
import { TemplateContractService } from './template-contract.service';

@ApiTags('Template-Contract')
@Controller('template-contract')
export class TemplateContractController {
  constructor(private readonly modelContractService: TemplateContractService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contract template' })
  @ApiResponse({ status: 201, description: 'Contract template successfully created.' })
  @ApiBody({ type: ContractTemplateDto })
  async create(@Body() dto: ContractTemplateDto) {
    return this.modelContractService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all contract templates' })
  @ApiOkResponse({ description: 'List of all contract templates.' })
  async findAll() {
    return this.modelContractService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a contract template by ID' })
  @ApiParam({ name: 'id', description: 'ID of the contract template', type: String })
  @ApiOkResponse({ description: 'Contract template found.' })
  async findOne(@Param('id') id: string) {
    return this.modelContractService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a contract template' })
  @ApiParam({ name: 'id', description: 'ID of the contract template', type: String })
  @ApiBody({ type: UpdateContractTemplateDto })
  @ApiOkResponse({ description: 'Contract template successfully updated.' })
  async update(@Param('id') id: string, @Body() dto: UpdateContractTemplateDto) {
    return this.modelContractService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a contract template' })
  @ApiParam({ name: 'id', description: 'ID of the contract template', type: String })
  @ApiOkResponse({ description: 'Contract template successfully removed.' })
  async remove(@Param('id') id: string) {
    return this.modelContractService.remove(id);
  }
}
