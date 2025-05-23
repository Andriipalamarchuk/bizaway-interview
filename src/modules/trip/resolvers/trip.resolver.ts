import { Args, Query, Resolver } from '@nestjs/graphql';
import { SortByEnum, SortDirectionEnum } from '../enums/sort.enum';
import { BadRequestException } from '@nestjs/common';
import { TripService } from '../services/trip.service';
import { TripSearchModel } from '../models/trip-search.model';
import { RouteEnum } from '../../../enums/route.enum';

@Resolver(RouteEnum.Trip)
export class TripResolver {
  constructor(private readonly _tripService: TripService) {}

  @Query(() => TripSearchModel)
  public async getPossibleTrips(
    @Args('origin') origin: string,
    @Args('destination') destination: string,
    @Args('sort_by', {
      type: () => SortByEnum,
      nullable: true,
    })
    sortBy: SortByEnum = SortByEnum.Fastest,
    @Args('sort_direction', {
      type: () => SortDirectionEnum,
      nullable: true,
    })
    sortDirection: SortDirectionEnum = SortDirectionEnum.ASC,
  ): Promise<TripSearchModel> {
    if (!origin) {
      throw new BadRequestException('Origin is required');
    } else if (origin.length !== 3) {
      throw new BadRequestException('Origin must be 3 characters');
    }

    if (!destination) {
      throw new BadRequestException('Destination is required');
    } else if (destination.length !== 3) {
      throw new BadRequestException('Destination must be 3 characters');
    }

    return await this._tripService.getPossibleTrips(
      origin.toUpperCase(),
      destination.toUpperCase(),
      sortBy,
      sortDirection,
    );
  }
}
