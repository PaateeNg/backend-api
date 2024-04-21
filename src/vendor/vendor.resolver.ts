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

  @Mutation((returns) => returnString)
  @UseGuards(GqlAuthGuard)
  updateVendor(
    @Args('updatePayload') payload: UpdateVendorDto,
    @GetCurrentGqlUser() vendor: VendorDocument,
  ): Promise<returnString> {
    return this.vendorService.updateVendor(payload, vendor);
  }

  @Query((returns) => [Vendor])
  getAll() {
    return this.vendorService.getAllVendors();
  }
}
