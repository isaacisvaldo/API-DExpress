import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { SendEmailDto } from './dto/send-email.dto'
import { MailerService } from '@nestjs-modules/mailer'

@ApiTags('EMAIL')
@Controller('email')
export class EmailController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send/html')
  @ApiOperation({ summary: 'Envia um e-mail' })
  async sendEmail(@Body() dto: SendEmailDto) {
    await this.mailerService.sendMail({
      to: dto.to,
      subject: dto.subject ?? 'Assunto padrão', 
      html: dto.html,
    })
    return { message: 'E-mail enviado com sucesso' }
  }
}
