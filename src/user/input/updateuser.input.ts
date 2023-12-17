import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateUserInput } from "./createuser.input.dto";

@InputType()
export class UpdateUserDto extends PartialType(CreateUserInput) {}

