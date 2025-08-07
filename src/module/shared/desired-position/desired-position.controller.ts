import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DesiredPositionService } from './desired-position.service';
import { CreateDesiredPositionDto } from './dto/create-desired-position.dto';
import { UpdateDesiredPositionDto } from './dto/update-desired-position.dto';

@Controller('desired-position')
export class DesiredPositionController {
  constructor(private readonly desiredPositionService: DesiredPositionService) {}

  @Post()
  create(@Body() createDesiredPositionDto: CreateDesiredPositionDto) {
    return this.desiredPositionService.create(createDesiredPositionDto);
  }

  @Get()
  findAll() {
    return this.desiredPositionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desiredPositionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDesiredPositionDto: UpdateDesiredPositionDto) {
    return this.desiredPositionService.update(+id, updateDesiredPositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desiredPositionService.remove(+id);
  }
}
