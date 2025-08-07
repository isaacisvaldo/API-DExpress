import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HighestDegreeService } from './highest-degree.service';
import { CreateHighestDegreeDto } from './dto/create-highest-degree.dto';
import { UpdateHighestDegreeDto } from './dto/update-highest-degree.dto';

@Controller('highest-degree')
export class HighestDegreeController {
  constructor(private readonly highestDegreeService: HighestDegreeService) {}

  @Post()
  create(@Body() createHighestDegreeDto: CreateHighestDegreeDto) {
    return this.highestDegreeService.create(createHighestDegreeDto);
  }

  @Get()
  findAll() {
    return this.highestDegreeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.highestDegreeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHighestDegreeDto: UpdateHighestDegreeDto) {
    return this.highestDegreeService.update(+id, updateHighestDegreeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.highestDegreeService.remove(+id);
  }
}
