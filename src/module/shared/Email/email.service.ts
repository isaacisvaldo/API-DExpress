// src/email/email.service.ts
import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendHtmlEmail(to: string, html: string, subject?: string) {
    await this.mailerService.sendMail({
      to,
      subject: subject || 'Nota sobre sua candidatura',
      html,
    })
  }
}
