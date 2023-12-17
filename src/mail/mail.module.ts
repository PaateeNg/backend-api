import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { plannerMongooseFeature, userMongooseFeature, vendorMongooseFeature } from 'src/common/mongoose/mongoose.connection';


@Module({
  imports: [
    userMongooseFeature,
    vendorMongooseFeature,
    plannerMongooseFeature
  ],
  providers: [
    MailService,
     ConfigService
    ],
  exports: [MailService],
  controllers: [],
})
export class MailModule {}