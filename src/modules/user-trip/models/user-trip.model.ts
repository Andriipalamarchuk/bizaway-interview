import { Field, ObjectType } from '@nestjs/graphql';
import { TripStatus } from '../enums/trip-status.enum';
import { TripModel } from '../../trip/models/trip.model';
import { TripType } from '../../trip/enums/trip-type.enum';

@ObjectType()
export class UserTripModel extends TripModel {
  @Field()
  id: string;

  @Field(() => TripStatus)
  status: TripStatus;

  constructor(
    id: string,
    origin: string,
    destination: string,
    cost: number,
    duration: number,
    status: TripStatus,
    type: TripType,
    displayName: string,
  ) {
    super(origin, destination, cost, duration, type, displayName);
    this.id = id;
    this.status = status;
  }
}
