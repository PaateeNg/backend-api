import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [MailService, ConfigService],
  exports: [MailService],
  controllers: [],
})
export class MailModule {}
