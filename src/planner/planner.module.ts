import { Module } from '@nestjs/common';
import { PlannerResolver } from './planner.resolver';
import { PlannerService } from './planner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Planner, PlannerSchema } from './schema/planner.schema';
import { OtpModule } from 'src/otp/module/otp.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Planner.name, schema: PlannerSchema }]),
    OtpModule,
  ],
  providers: [PlannerResolver, PlannerService],
  exports: [PlannerService],
  controllers: [],
})
export class PlannerModule {}
