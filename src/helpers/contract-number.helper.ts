import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable() 
export class ContractNumberHelper {
  constructor(private prisma: PrismaService) {}

  async generate(): Promise<string> {
    const year = new Date().getFullYear();

    // Cria uma sequência no banco
    const seq = await this.prisma.contractSequence.create({ data: {} });
    const sequence = String(seq.id).padStart(5, "0");

    // Gera código aleatório (5 caracteres)
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

    return `DEXPRESS-${year}-${sequence}/${randomCode}`;
  }
}
