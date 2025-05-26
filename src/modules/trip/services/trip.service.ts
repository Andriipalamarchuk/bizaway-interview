import { Injectable } from '@nestjs/common';
import { SortByEnum, SortDirectionEnum } from '../enums/sort.enum';
import { TripSearchModel } from '../models/trip-search.model';
import { BizawayService } from './bizaway.service';
import { TripModel } from '../models/trip.model';

@Injectable()
export class TripService {
  constructor(private readonly _bizawayService: BizawayService) {}

  //TODO: Asc Bizaway documentation in possible on their side to have pagination
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

  private sortTrips(
    trips: TripModel[],
    sortBy: SortByEnum,
    sortDirection: SortDirectionEnum,
  ): TripModel[] {
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
