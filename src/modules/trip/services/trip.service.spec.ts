import { TripService } from './trip.service';
import { Trip } from '../types/trip.type';
import { SortByEnum, SortDirectionEnum } from '../enums/sort.enum';
import { TripType } from '../enums/trip-type.enum';

describe('TripService', () => {
  let service: TripService;
  let bizawayService: any;

  const mockTrips: Trip[] = [
    {
      origin: 'A',
      destination: 'B',
      cost: 300,
      duration: 4,
      type: TripType.Flight,
      displayName: 'A-B',
    },
    {
      origin: 'A',
      destination: 'B',
      cost: 200,
      duration: 6,
      type: TripType.Flight,
      displayName: 'A-B',
    },
    {
      origin: 'A',
      destination: 'B',
      cost: 400,
      duration: 2,
      type: TripType.Flight,
      displayName: 'A-B',
    },
  ];

  beforeEach(() => {
    bizawayService = {};

    service = new TripService(bizawayService);
  });

  test('should call bizawayService and return sorted trips (Fastest, ASC)', async () => {
    bizawayService.getTrips = jest.fn(async () => mockTrips);

    const result = await service.getPossibleTrips(
      'A',
      'B',
      SortByEnum.Fastest,
      SortDirectionEnum.ASC,
    );

    expect(result.sortBy).toBe(SortByEnum.Fastest);
    expect(result.sortDirection).toBe(SortDirectionEnum.ASC);
    expect(result.trips.map((t) => t.duration)).toEqual([2, 4, 6]);
    expect(bizawayService.getTrips).toHaveBeenCalledWith('A', 'B');
  });

  test('should return sorted trips (Fastest, DESC)', async () => {
    bizawayService.getTrips = jest.fn(async () => mockTrips);

    const result = await service.getPossibleTrips(
      'A',
      'B',
      SortByEnum.Fastest,
      SortDirectionEnum.DESC,
    );

    expect(result.trips.map((t) => t.duration)).toEqual([6, 4, 2]);
  });

  test('should return sorted trips (Cheapest, ASC)', async () => {
    bizawayService.getTrips = jest.fn(async () => mockTrips);

    const result = await service.getPossibleTrips(
      'A',
      'B',
      SortByEnum.Cheapest,
      SortDirectionEnum.ASC,
    );

    expect(result.trips.map((t) => t.cost)).toEqual([200, 300, 400]);
  });

  test('should return sorted trips (Cheapest, DESC)', async () => {
    bizawayService.getTrips = jest.fn(async () => mockTrips);

    const result = await service.getPossibleTrips(
      'A',
      'B',
      SortByEnum.Cheapest,
      SortDirectionEnum.DESC,
    );

    expect(result.trips.map((t) => t.cost)).toEqual([400, 300, 200]);
  });
});
