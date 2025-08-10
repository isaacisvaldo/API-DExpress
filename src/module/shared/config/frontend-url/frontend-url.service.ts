// src/frontend-url/frontend-url.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service'; // Verifique o caminho
import { CreateFrontendUrlDto } from './dto/create-frontend-url.dto';
import { UpdateFrontendUrlDto } from './dto/update-frontend-url.dto';

@Injectable()
export class FrontendUrlService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova URL de frontend.
   */
  async create(createFrontendUrlDto: CreateFrontendUrlDto) {

    
    return this.prisma.frontendUrl.create({
      data: createFrontendUrlDto,
    });
  }

  /**
   * Retorna todas as URLs de frontend cadastradas.
   */
  async findAll() {
    return this.prisma.frontendUrl.findMany();
  }

  /**
   * Encontra uma URL específica pelo seu ID.
   */

  async getAllDomains(): Promise<string[]> {
  const url = await this.prisma.frontendUrl.findMany({
    select: { url: true },
  });

  return url.map(frontendUrl => frontendUrl.url.trim().replace(/\/$/, ''));
}

  async findOne(id: string) {
    const url = await this.prisma.frontendUrl.findUnique({
      where: { id },
    });
    if (!url) {
      throw new NotFoundException(`Frontend URL com ID "${id}" não encontrada.`);
    }
    return url;
  }

  /**
   * Atualiza uma URL existente.
   */
  async update(id: string, updateFrontendUrlDto: UpdateFrontendUrlDto) {
    try {
      return await this.prisma.frontendUrl.update({
        where: { id },
        data: updateFrontendUrlDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Frontend URL com ID "${id}" não encontrada.`);
      }
      throw error;
    }
  }

  /**
   * Remove uma URL do banco de dados.
   */
  async remove(id: string) {
    try {
      return await this.prisma.frontendUrl.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Frontend URL com ID "${id}" não encontrada.`);
      }
      throw error;
    }
  }
}