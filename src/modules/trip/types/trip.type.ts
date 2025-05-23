import { IBizawayTrip } from '../interfaces/bizaway-trip.interface';

export type Trip = Omit<IBizawayTrip, 'display_name'> & {
  displayName: string;
};
