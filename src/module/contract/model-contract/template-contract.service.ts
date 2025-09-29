import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ContractTemplateDto } from './dto/contract-template.dto';
import { UpdateContractTemplateDto } from './dto/update-contract-template.dto';
import { AuditLogService } from 'src/module/shared/auditLog/auditLog.service';

@Injectable()
export class TemplateContractService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(dto: ContractTemplateDto) {
    const created = await this.prisma.contractTemplate.create({
      data: {
        title: dto.title,
        description: dto.description,
        urlFile: dto.urlFile,
      },
    });

    await this.auditLogService.createLog({
      action: 'CREATE_CONTRACT_TEMPLATE',
      
      entity: 'ContractTemplate',
      entityId: created.id,
      description: `Contract template "${created.title}" criado`,
      newData: created,
      status: 'SUCCESS',
      source: 'USER',
    });

    return created;
  }

  async findAll() {
    return this.prisma.contractTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const contract = await this.prisma.contractTemplate.findUnique({
      where: { id },
    });

    if (!contract) {
      await this.auditLogService.createLog({
        action: 'READ_CONTRACT_TEMPLATE',
        entity: 'ContractTemplate',
        entityId: id,
        description: `Tentativa de buscar template inexistente ID=${id}`,
        status: 'FAILURE',
        source: 'USER',
      });
      throw new NotFoundException(`Contract template with ID ${id} not found`);
    }

    return contract;
  }

  async update(id: string, dto: UpdateContractTemplateDto) {
    const contract = await this.prisma.contractTemplate.findUnique({
      where: { id },
    });
    if (!contract) {
      await this.auditLogService.createLog({
        action: 'UPDATE_CONTRACT_TEMPLATE',
        entity: 'ContractTemplate',
        entityId: id,
        description: `Tentativa de atualizar template inexistente ID=${id}`,
        status: 'FAILURE',
        source: 'USER',
      });
      throw new NotFoundException(`Contract template with ID ${id} not found`);
    }

    const updated = await this.prisma.contractTemplate.update({
      where: { id },
      data: {
        title: dto.title ?? contract.title,
        description: dto.description ?? contract.description,
        urlFile: dto.urlFile ?? contract.urlFile,
      },
    });

    await this.auditLogService.createLog({
      action: 'UPDATE_CONTRACT_TEMPLATE',
      entity: 'ContractTemplate',
      entityId: id,
      description: `Template atualizado (${contract.title} → ${updated.title})`,
      previousData: contract,
      newData: updated,
      status: 'SUCCESS',
      source: 'USER',
    });

    return updated;
  }

  async remove(id: string) {
    const contract = await this.prisma.contractTemplate.findUnique({
      where: { id },
    });
    if (!contract) {
      await this.auditLogService.createLog({
        action: 'DELETE_CONTRACT_TEMPLATE',
        entity: 'ContractTemplate',
        entityId: id,
        description: `Tentativa de remover template inexistente ID=${id}`,
        status: 'FAILURE',
        source: 'USER',
      });
      throw new NotFoundException(`Contract template with ID ${id} not found`);
    }

    await this.prisma.contractTemplate.delete({
      where: { id },
    });

    await this.auditLogService.createLog({
      action: 'DELETE_CONTRACT_TEMPLATE',
      entity: 'ContractTemplate',
      entityId: id,
      description: `Template "${contract.title}" removido`,
      previousData: contract,
      status: 'SUCCESS',
      source: 'USER',
    });

    return { message: `Template ${id} removido com sucesso` };
  }
}
