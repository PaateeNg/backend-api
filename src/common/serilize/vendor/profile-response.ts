import { InputType, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Role } from 'src/common/enum/role.enum';

@ObjectType()
export class IVendor {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  business_phone: string;

  @Expose()
  role: Role;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  state: string;

  @Expose()
  userType: string;

  @Expose()
  businessName: string;

  @Expose()
  city: string;

  @Expose()
  category: string;

  @Expose()
  x: string;

  @Expose()
  instagram: string;

  @Expose()
  productMenu: String[];

  @Expose()
  date_joined: Date;
}
