import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { NewsletterSubscriber, Prisma } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

import { CreateNewsletterSubscriberDto } from './dto/create-newsletter-subscriber.dto';
import { FilterNewsletterSubscribersDto } from './dto/filter-newsletter-subscribers.dto';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) { }

  /**
   * Cria um novo assinante de newsletter no sistema,
   * garantindo que o e-mail não seja duplicado.
   * Envia um e-mail de boas-vindas ao novo assinante.
   * @param createNewsletterSubscriberDto DTO com o e-mail do assinante.
   * @returns O assinante criado e uma mensagem de sucesso.
   * @throws BadRequestException se o e-mail já estiver cadastrado.
   */
  async create(createNewsletterSubscriberDto: CreateNewsletterSubscriberDto) {
    const { email } = createNewsletterSubscriberDto;

    // 1. Verifica se já existe um assinante com o mesmo e-mail
    const existingSubscriber = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      throw new BadRequestException('Este e-mail já está inscrito na nossa newsletter.');
    }

    // 2. Cria o novo assinante no banco de dados
    const newSubscriber = await this.prisma.newsletterSubscriber.create({
      data: {
        email,
      },
    });

    // 3. Envia o e-mail de confirmação (opcional)
    await this.sendWelcomeEmail(newSubscriber.email);

    return {
    
      subscriberId: newSubscriber.id,
    };
  }

  /**
   * Busca todos os assinantes da newsletter com suporte a paginação e pesquisa.
   * @param query DTO com os parâmetros de consulta.
   * @returns Um objeto paginado com a lista de assinantes.
   */
  async findAll(query: FilterNewsletterSubscribersDto): Promise<PaginatedDto<NewsletterSubscriber>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filtersWhere: Prisma.NewsletterSubscriberWhereInput = {
      ...(query.search && {
        email: { contains: query.search, mode: 'insensitive' },
      }),
    };

    const [subscribers, total] = await this.prisma.$transaction([
      this.prisma.newsletterSubscriber.findMany({
        skip,
        take: limit,
        where: filtersWhere,
      }),
      this.prisma.newsletterSubscriber.count({ where: filtersWhere }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: subscribers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Remove um assinante da newsletter pelo seu ID ou e-mail.
   * @param id O ID do assinante a ser removido.
   * @returns O assinante removido.
   * @throws NotFoundException se o assinante não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.newsletterSubscriber.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Assinante com ID "${id}" não encontrado.`);
      }
      throw error;
    }
  }

  /**
   * Envia um e-mail de boas-vindas para o novo assinante.
   * @param email O e-mail do assinante.
   */
  private async sendWelcomeEmail(email: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f7f9fc; border-radius: 8px; padding: 20px; color: #333;">
        <div style="background-color: #051f42ff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Bem-vindo à nossa Newsletter!</h1>
        </div>
        <div style="padding: 20px; background: #ffffff; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px;">Olá,</p>
          <p style="font-size: 16px;">Sua inscrição foi confirmada com sucesso. Fique de olho na sua caixa de entrada para receber as últimas novidades e conteúdos exclusivos.</p>
          <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
            Este e-mail é automático. Por favor, não responda a esta mensagem.
          </p>
        </div>
      </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bem-vindo(a) à nossa Newsletter!',
      html: htmlContent,
    });
  }
}