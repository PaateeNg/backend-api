import { Field, InputType, PartialType } from "@nestjs/graphql";
import { VendorInput } from "./vendor.input";

@InputType()
export class UpdateVendorDto extends PartialType(VendorInput) {

}

