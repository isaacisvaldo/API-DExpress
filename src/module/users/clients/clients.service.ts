import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ClientProfile, Prisma, UserType } from '@prisma/client';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class ClientProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista todos os perfis de cliente com paginação e pesquisa.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<ClientProfile>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientProfileWhereInput = query.search
      ? {
          OR: [
            { fullName: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.clientProfile.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: true,
        },
      }),
      this.prisma.clientProfile.count({ where }),
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

  async create(
    userId: string,
    createDto: CreateClientProfileDto,
  ): Promise<ClientProfile> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID '${userId}' não encontrado.`);
    }

    if (user.type !== UserType.INDIVIDUAL) {
      throw new BadRequestException(
        `Usuário com ID '${userId}' não é do tipo INDIVIDUAL.`,
      );
    }

    const existingProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });
    if (existingProfile) {
      throw new BadRequestException(
        `Usuário com ID '${userId}' já possui um perfil de cliente.`,
      );
    }

    return this.prisma.clientProfile.create({
      data: {
        ...createDto,
        userId,
      },
    });
  }

  /**
   * Busca um perfil de cliente pelo seu ID.
   */
  async findOne(id: string): Promise<ClientProfile> {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil de cliente com ID '${id}' não encontrado.`);
    }
    return profile;
  }

  /**
   * Busca um perfil de cliente pelo ID do usuário.
   */
  async findByUserId(userId: string): Promise<ClientProfile> {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil de cliente para o usuário com ID '${userId}' não encontrado.`,
      );
    }
    return profile;
  }

  /**
   * Atualiza um perfil de cliente existente.
   */
  async update(
    id: string,
    updateDto: UpdateClientProfileDto,
  ): Promise<ClientProfile> {
    try {
      return await this.prisma.clientProfile.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Perfil de cliente com ID '${id}' não encontrado.`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Remove um perfil de cliente.
   */
  async remove(id: string): Promise<ClientProfile> {
    try {
      return await this.prisma.clientProfile.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Perfil de cliente com ID '${id}' não encontrado.`,
          );
        }
      }
      throw error;
    }
  }
}