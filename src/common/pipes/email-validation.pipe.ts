import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as dns from 'dns';
import { testDomains } from '../test-domain';

@Injectable()
export class EmailValidationPipe implements PipeTransform<string, Promise<string>> {
  async transform(email: string): Promise<string> {
    if (!email) {
      throw new BadRequestException('O e-mail do solicitante é obrigatório.');
    }

    const domain = email.split('@')[1];

    if (testDomains.includes(domain)) {
      throw new BadRequestException('E-mails de teste não são permitidos.');
    }

    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidFormat) {
      throw new BadRequestException('Formato de e-mail inválido.');
    }

    try {
      const mxRecords = await new Promise<dns.MxRecord[]>((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
          if (err) {
            return reject(err);
          }
          resolve(addresses);
        });
      });

      if (mxRecords.length === 0) {
        throw new BadRequestException('O domínio do e-mail não é válido.');
      }
    } catch (error) {
      throw new BadRequestException('O domínio do e-mail não é válido.');
    }

    return email;
  }
}