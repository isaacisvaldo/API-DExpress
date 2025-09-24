import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ContractTemplateDto } from './dto/contract-template.dto';
import { UpdateContractTemplateDto } from './dto/update-contract-template.dto';

@Injectable()
export class TemplateContractService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: ContractTemplateDto) {
    return this.prisma.contractTemplate.create({
      data: {
        title: dto.title,
        description: dto.description,
        urlFile: dto.urlFile,
      },
    });
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
      throw new NotFoundException(`Contract template with ID ${id} not found`);
    }
    return contract;
  }

  async update(id: string, dto: UpdateContractTemplateDto) {
    const contract = await this.prisma.contractTemplate.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Contract template with ID ${id} not found`);
    }

    return this.prisma.contractTemplate.update({
      where: { id },
      data: {
        title: dto.title ?? contract.title,
        description: dto.description ?? contract.description,
        urlFile: dto.urlFile ?? contract.urlFile,
      },
    });
  }

  async remove(id: string) {
    const contract = await this.prisma.contractTemplate.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Contract template with ID ${id} not found`);
    }

    return this.prisma.contractTemplate.delete({
      where: { id },
    });
  }
}
