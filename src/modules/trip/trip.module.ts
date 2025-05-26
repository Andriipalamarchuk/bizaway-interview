import { Module } from '@nestjs/common';
import { TripResolver } from './resolvers/trip.resolver';
import { TripService } from './services/trip.service';
import { BizawayService } from './services/bizaway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TripResolver, TripService, BizawayService],
})
export class TripModule {}
