import { TripType } from '../enums/trip-type.enum';

export interface IBizawayTrip {
  origin: string;
  destination: string;
  cost: number;
  duration: number;
  type: TripType;
  display_name: string;
}
