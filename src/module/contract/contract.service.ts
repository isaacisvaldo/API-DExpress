import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { FilterContractDto } from './dto/filter-contract.dto';
import { Contract, ContractStatus, Prisma, UserType } from '@prisma/client';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { ContractNumberHelper } from 'src/helpers/contract-number.helper';


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
  constructor(private readonly prisma: PrismaService,  private readonly contractNumberHelper: ContractNumberHelper) { }

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
      location,
      ...contractData
    } = createContractDto;



// Estados que bloqueiam nova contratação
const invalidStatuses: ContractStatus[] = [
  ContractStatus.DRAFT,
  ContractStatus.PENDING_SIGNATURE,
  ContractStatus.EXPIRED,
];

let clientField: "individualClientId" | "companyClientId" | null = null;
let clientId: string | null = null;

if (contractData.clientType === UserType.INDIVIDUAL) {
  clientField = "individualClientId";
  clientId = individualClientId ?? null; 
} else if (contractData.clientType === UserType.CORPORATE) {
  clientField = "companyClientId";
  clientId = companyClientId ?? null; 
}

if (clientField && clientId) {
  const existingContract = await this.prisma.contract.findFirst({
    where: {
      [clientField]: clientId,
      status: { in: invalidStatuses },
    },
  });

  if (existingContract) {
    throw new BadRequestException(
      `Não é possível criar novo contrato. O cliente já possui um contrato no estado ${existingContract.status}.`
    );
  }
}



    // Validação de consistência de dados
    if (contractData.clientType === UserType.INDIVIDUAL) {
      if (!individualClientId || !professionalId) {
        throw new BadRequestException(
          'Para clientes individuais, `individualClientId` e `professionalId` são obrigatórios.'
        );
      }
    } else if (contractData.clientType === UserType.CORPORATE) {
      if (!companyClientId || !professionalIds || professionalIds.length === 0) {
        throw new BadRequestException(
          'Para clientes empresariais, `companyClientId` e `professionalIds` são obrigatórios.'
        );
      }
    }
        

    return this.prisma.$transaction(async (prisma) => {
      // 1. Valida se os profissionais existem
      if (professionalIds && professionalIds.length > 0) {
        const existingProfessionals = await prisma.professional.findMany({
          where: { id: { in: professionalIds } },
          select: { id: true },
        });

        if (existingProfessionals.length !== professionalIds.length) {
          const foundIds = existingProfessionals.map((p) => p.id);
          const notFoundIds = professionalIds.filter((id) => !foundIds.includes(id));
          throw new NotFoundException(
            `Os seguintes IDs de profissionais não foram encontrados: ${notFoundIds.join(', ')}`
          );
        }
      }

      // 2. Criação da Localização
      const endereco = await prisma.location.create({
        data: {
          cityId: location.cityId,
          districtId: location.districtId,
          street: location.street,
        },
      });

      // 3. Montagem do contrato base
     const contractNumber = await this.contractNumberHelper.generate();
       
        let contractDataToSave: any = {
         contractNumber,
        title: contractData.title ?? "Contract Title",
        clientType: contractData.clientType,
        packageId: packageId ?? null,
        desiredPositionId: desiredPositionId ?? null,
        description: contractData.description ?? "",
        serviceFrequency: "ANNUALLY",
        agreedValue: contractData.agreedValue ?? 0.0,
        discountPercentage: contractData.discountPercentage ?? 0.0,
        finalValue: contractData.finalValue ?? 0.0,
        paymentTerms: contractData.paymentTerms ?? "Teste",
        startDate: contractData.startDate ? new Date(contractData.startDate) : new Date(),
        endDate: contractData.endDate ? new Date(contractData.endDate) : null,
        status: "ACTIVE",
        locationId: endereco.id,
        notes: contractData.notes ?? null,
      };

      // 4. Diferenciação por tipo de cliente
      if (contractData.clientType === UserType.INDIVIDUAL) {
        contractDataToSave = {
          ...contractDataToSave,
          packageId: null,
          professionalId,
          individualClientId,
          companyClientId: null,
        };
      } else if (contractData.clientType === UserType.CORPORATE) {
        contractDataToSave = {
          ...contractDataToSave,
          professionalId: null,
          desiredPositionId: null,
          individualClientId: null,
          companyClientId,
        };
      }

      // 5. Criação do contrato
      const newContract = await prisma.contract.create({
        data: contractDataToSave,
      });

      // 6. Criação da tabela de junção PARA CLIENTES CORPORATIVOS
      if (contractData.clientType === UserType.CORPORATE && professionalIds && professionalIds.length > 0) {
        const contractPackageProfessionalData = professionalIds.map((id) => ({
          professionalId: id,
          contractId: newContract.id,
        }));

        await prisma.contractPackegeProfissional.createMany({
          data: contractPackageProfessionalData,
        });
      }
   await this.marcarProfissionaisIndisponiveis(
  prisma,
  contractData.clientType,
  professionalId,
  professionalIds,
);
     
      const createdContract = await prisma.contract.findUnique({
        where: { id: newContract.id },
        include: contractInclude,
      });

      return createdContract!;
    }, {
      timeout: 30000,
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
   * Atualiza o status de um contrato
   * @param contractId ID do contrato
   * @param newStatus Novo status (enum ContractStatus)
   */
  async updateContractStatus(contractId: string, newStatus: ContractStatus) {
    // Verifica se o contrato existe
    const contract = await this.findOne(contractId);
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${contractId} não encontrado.`);
    }

    // Atualiza o status
    return this.prisma.contract.update({
      where: { id: contractId },
      data: { status: newStatus },
    });
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
      location,
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


async marcarProfissionaisIndisponiveis(
  prisma: Prisma.TransactionClient, 
  clientType: UserType,
  professionalId?: string,
  professionalIds?: string[],
) {
  if (clientType === UserType.INDIVIDUAL && professionalId) {
    await prisma.professional.update({
      where: { id: professionalId },
      data: { isAvailable: false },
    });
  }

  if (clientType === UserType.CORPORATE && professionalIds && professionalIds.length > 0) {
    await prisma.professional.updateMany({
      where: { id: { in: professionalIds } },
      data: { isAvailable: false },
    });
  }
}


}
let lastSequence = 0; 
async function generateContractNumber(): Promise<string> {
  const year = new Date().getFullYear();
  lastSequence++;
  const sequence = String(lastSequence).padStart(5, "0");
  const randomCode = Math.random().toString(36).substr(2, 2).toUpperCase();

  return `DEXPRESS-${year}-${sequence}/${randomCode}`;
}

