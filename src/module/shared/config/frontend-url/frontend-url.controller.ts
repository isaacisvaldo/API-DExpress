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

@Controller('frontend-urls')
export class FrontendUrlController {
  constructor(private readonly frontendUrlService: FrontendUrlService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFrontendUrlDto: CreateFrontendUrlDto) {
    return this.frontendUrlService.create(createFrontendUrlDto);
  }

  @Get()
  findAll() {
    return this.frontendUrlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frontendUrlService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFrontendUrlDto: UpdateFrontendUrlDto) {
    return this.frontendUrlService.update(id, updateFrontendUrlDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.frontendUrlService.remove(id);
  }
}