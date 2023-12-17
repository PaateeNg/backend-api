import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import {  plannerMongooseFeature, userMongooseFeature, vendorMongooseFeature } from 'src/common/mongoose/mongoose.connection';
import { AuthModule } from 'src/auth/auth.module';
import { StatusResolver } from './status.resolver';

@Module({
  imports: [
    AuthModule,
    userMongooseFeature,
    vendorMongooseFeature,
    plannerMongooseFeature,
  ],

  providers: [
    UserResolver, 
    UserService,
    JwtService,
    MailService,
    ConfigService,
    StatusResolver
  ],
  exports: [UserService],
  controllers: [],
})
export class UserModule {}
