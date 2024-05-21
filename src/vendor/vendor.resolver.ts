import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorService } from './vendor.service';
import { Vendor, VendorDocument } from './schema/vendor.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { returnString } from 'src/common/return/return.input';
import { UpdateVendorDto } from './input/vendor.input';

@Resolver((of) => Vendor)
export class VendorResolver {
  constructor(private vendorService: VendorService) {}

  @Mutation((returns) => Vendor)
  @UseGuards(GqlAuthGuard)
  updateVendor(
    @Args('payload') payload: UpdateVendorDto,
    @GetCurrentGqlUser() vendor: VendorDocument,
  ): Promise<VendorDocument> {
    return this.vendorService.updateVendor(payload, vendor._id);
  }

  @Query((returns) => [Vendor])
  getAllVendor(): Promise<VendorDocument[]> {
    return this.vendorService.getAllVendors();
  }
}
