import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo perfil no banco de dados.
   * Ele também cria as permissões se elas não existirem e as associa ao perfil.
   * @param createProfileDto O DTO com os dados para criar o perfil.
   * @returns O perfil recém-criado, incluindo as permissões associadas.
   */
  async create(createProfileDto: CreateProfileDto) {
    // Extrai as permissões do DTO para tratar separadamente
    const { permissions, ...profileData } = createProfileDto;

    return this.prisma.profile.create({
      data: {
        ...profileData,
        permissions: {
          // Cria as permissões se não existirem e as associa ao perfil
          connectOrCreate: permissions?.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { permissions: true }, // Inclui as permissões na resposta
    });
  }

  /**
   * Retorna uma lista paginada de perfis, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de perfis, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Profile>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProfileWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.profile.findMany({ 
        skip, 
        take: limit, 
        where,
        include: { permissions: true }, // ✅ Inclui as permissões na busca
      }),
      this.prisma.profile.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: profiles,
      total,
      page,
      limit,
      totalPages,
    } as PaginatedDto<Profile>;
  }

  /**
   * Retorna uma lista completa de todos os perfis, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<Profile[]> {
    return this.prisma.profile.findMany();
  }

  /**
   * Encontra um perfil específico pelo seu ID.
   * @param id O ID do perfil (UUID em string).
   * @returns O perfil encontrado, incluindo as permissões.
   * @throws NotFoundException se o perfil não for encontrado.
   */
  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({ 
      where: { id },
      include: { permissions: true }, // ✅ Inclui as permissões na busca por ID
    });
    if (!profile) {
      throw new NotFoundException(`Perfil com o ID "${id}" não encontrado`);
    }
    return profile;
  }

  /**
   * Atualiza um perfil existente.
   * @param id O ID do perfil a ser atualizado (UUID em string).
   * @param updateProfileDto O DTO com os dados a serem atualizados.
   * @returns O perfil atualizado.
   * @throws NotFoundException se o perfil não for encontrado.
   */
  async update(id: string, updateProfileDto: UpdateProfileDto) {
    // Extrai as permissões do DTO para tratar separadamente
    const { permissions, ...profileData } = updateProfileDto;
    
    // Constrói o objeto de dados para a atualização
    const data: Prisma.ProfileUpdateInput = {
        ...profileData,
        // ✅ Substitui a lista de permissões se o array estiver presente no DTO
        permissions: permissions ? {
            set: [], // Disconecta todas as permissões atuais
            connectOrCreate: permissions.map((name) => ({
                where: { name },
                create: { name },
            })),
        } : undefined,
    };

    try {
      return await this.prisma.profile.update({ 
        where: { id }, 
        data: data,
        include: { permissions: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Perfil com o ID "${id}" não encontrado`);
      }
      throw error;
    }
  }

  /**
   * Remove um perfil do banco de dados.
   * @param id O ID do perfil a ser removido (UUID em string).
   * @returns O perfil que foi removido.
   * @throws NotFoundException se o perfil não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.profile.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Perfil com o ID "${id}" não encontrado`);
      }
      throw error;
    }
  }
}
