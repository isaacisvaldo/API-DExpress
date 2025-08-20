import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileService } from './file.service';
import { PermissionsGuard } from 'src/common';

@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
    @UseGuards(PermissionsGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  }))
  async upload(@UploadedFile() file: Express.Multer.File) {
  
    return this.fileService.uploadFile(file);
  }
}