import { Injectable } from '@nestjs/common';
import { SortByEnum, SortDirectionEnum } from '../enums/sort.enum';
import { TripSearchModel } from '../models/trip-search.model';
import { BizawayService } from './bizaway.service';
import { Trip } from '../schemas/trip.schema';

@Injectable()
export class TripService {
  constructor(private readonly _bizawayService: BizawayService) {}

  public async getPossibleTrips(
    origin: string,
    destination: string,
    sortBy: SortByEnum,
    sortDirection: SortDirectionEnum,
  ): Promise<TripSearchModel> {
    const responseTrips = await this._bizawayService.getTrips(origin, destination);
    return {
      trips: this.sortTrips(responseTrips, sortBy, sortDirection),
      sortBy,
      sortDirection,
    };
  }

  private sortTrips(trips: Trip[], sortBy: SortByEnum, sortDirection: SortDirectionEnum): Trip[] {
    const sortField = sortBy === SortByEnum.Fastest ? 'duration' : 'cost';

    return trips.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (sortDirection === SortDirectionEnum.ASC) {
        return aVal <= bVal ? -1 : 1;
      }

      return aVal >= bVal ? -1 : 1;
    });
  }
}
