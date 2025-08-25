import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { FilterContractDto } from './dto/filter-contract.dto';
import { Contract, Prisma, UserType } from '@prisma/client';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';


const contractInclude = {
  professional: true,
  individualClient: true,
  companyClient: true,
  package: true,
  desiredPosition: true,
  location: {
    include: {
      city: true,
      district: true,
    },
  },
  contractPackegeProfissional: {
    include: {
      professional: true,
    },
  },
};

// Define um tipo auxiliar para o retorno das consultas, baseado no `include`
type ContractWithRelations = Prisma.ContractGetPayload<{
  include: typeof contractInclude;
}>;


@Injectable()
export class ContractService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo contrato no banco de dados.
   *
   * @param createContractDto O DTO com os dados para criação do contrato.
   * @returns O objeto de contrato criado, incluindo suas relações.
   * @throws NotFoundException Se um ID de relacionamento não for encontrado.
   * @throws BadRequestException Se os dados de cliente/profissional não forem consistentes.
   */
  async create(createContractDto: CreateContractDto): Promise<ContractWithRelations> {
    const {
      professionalId,
      professionalIds,
      individualClientId,
      companyClientId,
      packageId,
      desiredPositionId,
      locationId,
      ...contractData
    } = createContractDto;

    // Validação de consistência de dados
    if (contractData.clientType === UserType.INDIVIDUAL) {
      if (!individualClientId || !professionalId) {
        throw new BadRequestException('Para clientes individuais, `individualClientId` e `professionalId` são obrigatórios.');
      }
    } else if (contractData.clientType === UserType.CORPORATE) {
      if (!companyClientId || !professionalIds || professionalIds.length === 0) {
        throw new BadRequestException('Para clientes empresariais, `companyClientId` e `professionalIds` são obrigatórios.');
      }
    }
    // Transação para garantir atomicidade
    return this.prisma.$transaction(async (prisma) => {
      // 1. Se houver professionalIds, valida se eles existem
      if (professionalIds && professionalIds.length > 0) {
        const existingProfessionals = await prisma.professional.findMany({
          where: {
            id: { in: professionalIds },
          },
          select: { id: true },
        });

        if (existingProfessionals.length !== professionalIds.length) {
          const foundIds = existingProfessionals.map((p) => p.id);
          const notFoundIds = professionalIds.filter(
            (id) => !foundIds.includes(id),
          );
          throw new NotFoundException(`Os seguintes IDs de profissionais não foram encontrados: ${notFoundIds.join(', ')}`);
        }
      }

      // 2. Criação do Contrato principal
      const newContract = await prisma.contract.create({
        data: {
          ...contractData,
          // Conecta os relacionamentos de cliente, pacote, etc.
          ...(individualClientId && {
            individualClient: { connect: { id: individualClientId } },
          }),
          ...(companyClientId && {
            companyClient: { connect: { id: companyClientId } },
          }),
          ...(packageId && {
            package: { connect: { id: packageId } },
          }),
          ...(desiredPositionId && {
            desiredPosition: { connect: { id: desiredPositionId } },
          }),
          location: { connect: { id: locationId } },
          // Apenas um professionalId para clientes individuais
          ...(professionalId && {
            professional: { connect: { id: professionalId } },
          }),
        },
      });

      // 3. Se for um cliente empresarial, cria as entradas na tabela de junção
      if (
        contractData.clientType === UserType.CORPORATE &&
        professionalIds &&
        professionalIds.length > 0
      ) {
        const contractPackageProfessionalData = professionalIds.map(
          (id) => ({
            professionalId: id,
            contractId: newContract.id,
          }),
        );
        await prisma.contractPackegeProfissional.createMany({
          data: contractPackageProfessionalData,
        });
      }

      // Retorna o contrato recém-criado com suas relações
      const createdContract = await prisma.contract.findUnique({
        where: { id: newContract.id },
        include: contractInclude,
      });
      // Usa o operador de asserção de não-nulo, pois o registro acabou de ser criado.
      return createdContract!;
    });
  }

  /**
   * Busca contratos com filtros e paginação.
   *
   * @param filter O DTO com os filtros e dados de paginação.
   * @returns Uma lista paginada de contratos.
   */
  async findAll(
    filter: FilterContractDto,
  ): Promise<PaginatedDto<ContractWithRelations>> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ContractWhereInput = {
      title: filter.title
        ? { contains: filter.title, mode: 'insensitive' }
        : undefined,
      clientType: filter.clientType || undefined,
      locationId: filter.locationId || undefined,
      packageId: filter.packageId || undefined,
      serviceFrequency: filter.serviceFrequency || undefined,
      status: filter.status || undefined,

      // Filtra por IDs de profissionais através da tabela de junção
      contractPackegeProfissional: filter.professionalIds
        ? {
            some: {
              professionalId: { in: filter.professionalIds },
            },
          }
        : undefined,
    };

    const [contracts, total] = await this.prisma.$transaction([
      this.prisma.contract.findMany({
        skip,
        take: limit,
        where,
        include: contractInclude,
      }),
      this.prisma.contract.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: contracts,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Busca um único contrato pelo seu ID.
   *
   * @param id O ID do contrato a ser buscado.
   * @returns O objeto de contrato encontrado.
   * @throws NotFoundException Se o contrato com o ID fornecido não for encontrado.
   */
  async findOne(id: string): Promise<ContractWithRelations> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: contractInclude,
    });

    if (!contract) {
      throw new NotFoundException(`Contrato com ID "${id}" não encontrado.`);
    }

    return contract;
  }

  /**
   * Atualiza um contrato existente.
   * @param id O ID do contrato a ser atualizado.
   * @param updateContractDto O DTO com os dados para atualização.
   * @returns O contrato atualizado.
   * @throws NotFoundException Se o contrato não for encontrado.
   */
  async update(id: string, updateContractDto: UpdateContractDto): Promise<ContractWithRelations> {
    const {
      professionalId,
      professionalIds,
      individualClientId,
      companyClientId,
      packageId,
      desiredPositionId,
      locationId,
      ...contractData
    } = updateContractDto;

    // Use uma transação para garantir a atomicidade da atualização
    return this.prisma.$transaction(async (prisma) => {
      // 1. Atualiza os dados diretos do contrato
      const updatedContract = await prisma.contract.update({
        where: { id },
        data: {
          ...contractData,
          // Conecta os relacionamentos usando os IDs fornecidos no DTO
          ...(individualClientId !== undefined && {
            individualClient: { connect: { id: individualClientId } },
          }),
          ...(companyClientId !== undefined && {
            companyClient: { connect: { id: companyClientId } },
          }),
          ...(packageId !== undefined && {
            package: { connect: { id: packageId } },
          }),
          ...(desiredPositionId !== undefined && {
            desiredPosition: { connect: { id: desiredPositionId } },
          }),
          ...(locationId !== undefined && {
            location: { connect: { id: locationId } },
          }),
          // Atualiza o professionalId para clientes individuais
          ...(professionalId !== undefined && {
            professional: { connect: { id: professionalId } },
          }),
        },
      });

      // 2. Se for um cliente empresarial, sincroniza as entradas da tabela de junção.
      if (updatedContract.clientType === UserType.CORPORATE) {
        // Primeiro, deleta todas as entradas antigas para este contrato
        await prisma.contractPackegeProfissional.deleteMany({
          where: { contractId: id },
        });

        // Em seguida, cria as novas entradas se o array não for vazio
        if (professionalIds && professionalIds.length > 0) {
          const newEntries = professionalIds.map((pId) => ({
            contractId: id,
            professionalId: pId,
          }));
          await prisma.contractPackegeProfissional.createMany({
            data: newEntries,
          });
        }
      }

      // 3. Retorna o contrato atualizado com as relações
      const finalContract = await prisma.contract.findUnique({
        where: { id },
        include: contractInclude,
      });
      // Usa o operador de asserção de não-nulo, pois o registro acabou de ser atualizado.
      return finalContract!;
    });
  }

  /**
   * Remove um contrato do banco de dados.
   *
   * @param id O ID do contrato a ser removido.
   * @returns O contrato que foi removido.
   * @throws NotFoundException Se o contrato com o ID fornecido não for encontrado.
   */
  async remove(id: string): Promise<Contract> {
    try {
      return await this.prisma.contract.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Contrato com ID "${id}" não encontrado.`);
      }
      throw error;
    }
  }
}
