import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripSchema } from './schemas/trip.schema';
import { TripResolver } from './resolvers/trip.resolver';
import { TripService } from './services/trip.service';
import { BizawayService } from './services/bizaway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Trip', schema: TripSchema }]), HttpModule],
  providers: [TripResolver, TripService, BizawayService],
})
export class TripModule {}
