import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { StatusResolver } from './status.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],

  providers: [UserResolver, UserService, StatusResolver],
  exports: [UserService],
  controllers: [],
})
export class UserModule {}
