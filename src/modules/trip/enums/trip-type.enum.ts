import { registerEnumType } from '@nestjs/graphql';

export enum TripType {
  Flight = 'flight',
  Car = 'car',
  Bus = 'bus',
  Train = 'train',
  Ship = 'ship',
}

registerEnumType(TripType, {
  name: 'TripType',
});
