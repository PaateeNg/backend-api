import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMessage(toEmail: string, subject: string, template: string) {
    return await this.mailerService.sendMail({
      to: toEmail,
      subject,
      html: template,
    });
  }
}
