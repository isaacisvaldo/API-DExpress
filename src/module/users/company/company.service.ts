// src/company/client-company-profile.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, ClientCompanyProfile, UserType } from '@prisma/client';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class ClientCompanyProfileService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Lista todos os perfis de empresa com paginação e pesquisa.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<ClientCompanyProfile>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientCompanyProfileWhereInput = query.search
      ? {
        OR: [
          { companyName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
          { nif: { contains: query.search, mode: 'insensitive' } },
        ],
      }
      : {};

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.clientCompanyProfile.findMany({
        skip,
        take: limit,
        where,
        include: {

          sector: true,
        },
      }),
      this.prisma.clientCompanyProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: profiles,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Cria um novo perfil de empresa para um usuário.
   */
  async create(

    createDto: CreateCompanyProfileDto,
  ): Promise<ClientCompanyProfile> {


    return this.prisma.clientCompanyProfile.create({
      data: {
        ...createDto,

      },
    });
  }

  /**
   * Busca um perfil de empresa pelo seu ID.
   */
  async findOne(id: string): Promise<ClientCompanyProfile> {
    const profile = await this.prisma.clientCompanyProfile.findUnique({
      where: { id },
      include: {

        sector: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil de empresa com ID '${id}' não encontrado.`,
      );
    }
    return profile;
  }



  /**
   * Atualiza um perfil de empresa existente.
   */
  async update(
    id: string,
    updateDto: UpdateCompanyProfileDto,
  ): Promise<ClientCompanyProfile> {
    try {
      return await this.prisma.clientCompanyProfile.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Perfil de empresa com ID '${id}' não encontrado.`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Remove um perfil de empresa.
   */
  async remove(id: string): Promise<ClientCompanyProfile> {
    try {
      return await this.prisma.clientCompanyProfile.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Perfil de empresa com ID '${id}' não encontrado.`,
          );
        }
      }
      throw error;
    }
  }
}