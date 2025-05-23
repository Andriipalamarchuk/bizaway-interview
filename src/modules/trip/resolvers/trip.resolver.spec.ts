import { TripResolver } from './trip.resolver';
import { BadRequestException } from '@nestjs/common';
import { TripSearchModel } from '../models/trip-search.model';
import { TripType } from '../enums/trip-type.enum';
import { SortByEnum, SortDirectionEnum } from '../enums/sort.enum';

describe('TripResolver', () => {
  let resolver: TripResolver;
  let tripService: any;

  const mockTripSearchModel: TripSearchModel = {
    trips: [
      {
        origin: 'SYD',
        destination: 'GRU',
        cost: 100,
        duration: 10,
        type: TripType.Flight,
        displayName: 'from SYD to GRU by flight',
      },
    ],
    sortBy: SortByEnum.Fastest,
    sortDirection: SortDirectionEnum.ASC,
  };

  beforeEach(() => {
    tripService = {};

    resolver = new TripResolver(tripService);
  });

  test('should call TripService with uppercased args and return result', async () => {
    tripService.getPossibleTrips = jest.fn(async () => mockTripSearchModel);

    const result = await resolver.getPossibleTrips('syd', 'gru');

    expect(tripService.getPossibleTrips).toHaveBeenCalledWith(
      'SYD',
      'GRU',
      SortByEnum.Fastest,
      SortDirectionEnum.ASC,
    );
    expect(result).toEqual(mockTripSearchModel);
  });

  test('should throw BadRequest if origin is missing', async () => {
    await expect(resolver.getPossibleTrips('', 'GRU')).rejects.toThrow(
      new BadRequestException('Origin is required'),
    );
  });

  test('should throw BadRequest if origin is not 3 characters', async () => {
    await expect(resolver.getPossibleTrips('AB', 'GRU')).rejects.toThrow(
      new BadRequestException('Origin must be 3 characters'),
    );
  });

  test('should throw BadRequest if destination is missing', async () => {
    await expect(resolver.getPossibleTrips('SYD', '')).rejects.toThrow(
      new BadRequestException('Destination is required'),
    );
  });

  test('should throw BadRequest if destination is not 3 characters', async () => {
    await expect(resolver.getPossibleTrips('SYD', 'LONG')).rejects.toThrow(
      new BadRequestException('Destination must be 3 characters'),
    );
  });

  test('should use custom sortBy and sortDirection if provided', async () => {
    tripService.getPossibleTrips = jest.fn(async () => mockTripSearchModel);

    await resolver.getPossibleTrips('SYD', 'GRU', SortByEnum.Cheapest, SortDirectionEnum.DESC);

    expect(tripService.getPossibleTrips).toHaveBeenCalledWith(
      'SYD',
      'GRU',
      SortByEnum.Cheapest,
      SortDirectionEnum.DESC,
    );
  });
});
