import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { StatusResolver } from './status.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { OtpModule } from 'src/otp/module/otp.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OtpModule,
  ],

  providers: [UserResolver, UserService, StatusResolver],
  exports: [UserService],
  controllers: [],
})
export class UserModule {}
