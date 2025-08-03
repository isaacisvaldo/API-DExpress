// src/seeder/admin.seeder.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
  }
}
