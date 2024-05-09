import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from '../schemas/otp.schema';
import { MailModule } from 'src/mail/mail.module';
import { OtpService } from '../service/otp.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    MailModule,
  ],
  controllers: [],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
