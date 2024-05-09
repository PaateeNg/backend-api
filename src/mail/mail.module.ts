import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ENVIRONMENT } from 'src/common/constant/environment/env.variable';
import { EmailService } from './mail.service';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: ENVIRONMENT.SMTP.MAIL_USER,
          pass: ENVIRONMENT.SMTP.MAIL_PASSWORD,
        },
      },

      defaults: {
        from: '"No Reply" <noreply@patee.ng>',
      },
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class MailModule {}
