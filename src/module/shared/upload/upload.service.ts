import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = './uploads';

  constructor() {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    const savedFiles: Array<{
      originalName: string;
      savedAs: string;
      mimetype: string;
      path: string;
      size: number;
    }> = [];

    for (const file of files) {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      const filePath = join(this.uploadDir, uniqueName);
      writeFileSync(filePath, file.buffer);

      savedFiles.push({
        originalName: file.originalname,
        savedAs: uniqueName,
        mimetype: file.mimetype,
        path: filePath,
        size: file.size,
      });
    }

    return savedFiles;
  }
}
