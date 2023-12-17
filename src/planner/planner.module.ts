import { Module } from '@nestjs/common';
import { PlannerResolver } from './planner.resolver';
import { PlannerService } from './planner.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import {  plannerMongooseFeature, userMongooseFeature, vendorMongooseFeature } from 'src/common/mongoose/mongoose.connection';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    userMongooseFeature,
    vendorMongooseFeature,
    plannerMongooseFeature,
  ],
  providers: [PlannerResolver,
    PlannerService,
    ConfigService,
    MailService
  ],
  exports: [PlannerService],
  controllers: []
})
export class PlannerModule {}
