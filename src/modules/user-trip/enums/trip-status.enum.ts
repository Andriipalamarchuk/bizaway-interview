import { registerEnumType } from '@nestjs/graphql';

export enum TripStatus {
  Booked = 'booked',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

registerEnumType(TripStatus, {
  name: 'TripStatus',
});
