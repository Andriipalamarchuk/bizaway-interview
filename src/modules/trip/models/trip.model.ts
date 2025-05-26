import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { TripType } from '../enums/trip-type.enum';

@ObjectType()
export class TripModel {
  @Field()
  origin: string;

  @Field()
  destination: string;

  @Field(() => Float)
  cost: number;

  @Field(() => Int)
  duration: number;

  @Field(() => TripType)
  type: TripType;

  @Field()
  displayName: string;

  constructor(
    origin: string,
    destination: string,
    cost: number,
    duration: number,
    type: TripType,
    displayName: string,
  ) {
    this.origin = origin;
    this.destination = destination;
    this.cost = cost;
    this.duration = duration;
    this.type = type;
    this.displayName = displayName;
  }
}
