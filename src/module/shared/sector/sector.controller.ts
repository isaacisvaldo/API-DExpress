// src/sector/sector.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode, // Import HttpCode
  HttpStatus, // Import HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorService } from './sector.service';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { Sector } from '@prisma/client';

@ApiTags('Sectors')
@ApiBearerAuth() // Assumes JWT authentication is in place
@Controller('sectors')
export class SectorController {
  constructor(private readonly sectorService: SectorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Explicitly set 201 Created status
  @ApiOperation({ summary: 'Create a new sector.' })
  @ApiResponse({ status: 201, description: 'Sector created successfully.', })
  @ApiResponse({ status: 400, description: 'Invalid input or sector already exists.' })
  async create(@Body() createDto: CreateSectorDto): Promise<Sector> {
    return this.sectorService.create(createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK) // Explicitly set 200 OK status
  @ApiOperation({ summary: 'List all sectors with pagination and search.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for name or label' })
  @ApiResponse({ status: 200, description: 'Paginated list of sectors.', type: PaginatedDto }) // Adjust type if PaginatedDto is generic
  async findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Sector>> {
    return this.sectorService.findAll(query);
  }

  @Get('list') // New endpoint for non-paginated list
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all sectors for dropdowns/selects (no pagination).' })
  @ApiResponse({ status: 200, description: 'List of all sectors.'})
  async findAllList(): Promise<Sector[]> {
    return this.sectorService.findAllList();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find a sector by ID.' })
  @ApiResponse({ status: 200, description: 'Sector found.', })
  @ApiResponse({ status: 404, description: 'Sector not found.' })
  async findOne(@Param('id') id: string): Promise<Sector> {
    return this.sectorService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a sector by ID.' })
  @ApiResponse({ status: 200, description: 'Sector updated successfully.', })
  @ApiResponse({ status: 404, description: 'Sector not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input or name already in use.' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateSectorDto): Promise<Sector> {
    return this.sectorService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // A successful delete typically returns 200 OK or 204 No Content
  @ApiOperation({ summary: 'Delete a sector by ID.' })
  @ApiResponse({ status: 200, description: 'Sector deleted successfully.', })
  @ApiResponse({ status: 404, description: 'Sector not found.' })
  async remove(@Param('id') id: string): Promise<Sector> {
    return this.sectorService.remove(id);
  }
}