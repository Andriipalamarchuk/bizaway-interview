import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTripSchema } from './schemas/user-trip.schema';
import { UserTripRepository } from './repositories/user-trip.repository';
import { UserTripService } from './services/user-trip.service';
import { UserTripResolver } from './resolvers/user-trip.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'UserTrip', schema: UserTripSchema }])],
  providers: [UserTripRepository, UserTripService, UserTripResolver],
})
export class UserTripModule {}
