import { UserTripResolver } from './user-trip.resolver';
import { BadRequestException } from '@nestjs/common';
import { TripStatus } from '../enums/trip-status.enum';

describe('UserTripResolver', () => {
  let resolver: UserTripResolver;
  let service: any;

  beforeEach(() => {
    service = {};
    resolver = new UserTripResolver(service);
  });

  afterEach(() => jest.clearAllMocks());

  describe('trips', () => {
    test('should return all user trips', async () => {
      const userId = 'user123';
      const trips = [{ id: 't1' }, { id: 't2' }];
      service.getAllTrips = jest.fn(async () => trips);

      const result = await resolver.trips(userId);
      expect(result).toEqual(trips);
      expect(service.getAllTrips).toHaveBeenCalledWith(userId);
    });
  });

  describe('trip', () => {
    test('should return single user trip', async () => {
      const userId = 'user123';
      const id = 'trip1';
      const trip = { id };
      service.getTrip = jest.fn(async () => trip);

      const result = await resolver.trip(userId, id);
      expect(result).toEqual(trip);
      expect(service.getTrip).toHaveBeenCalledWith(userId, id);
    });

    test('should throw if id is missing', async () => {
      await expect(resolver.trip('user123', '')).rejects.toThrow(
        new BadRequestException('Id is required'),
      );
    });
  });

  describe('bookTrip', () => {
    test('should book a new trip', async () => {
      const input = { origin: 'LAX', destination: 'JFK' } as any;
      const userId = 'user123';
      const booked = { id: 'trip1' };
      service.bookTrip = jest.fn(async () => booked);

      const result = await resolver.bookTrip(input, userId);
      expect(result).toEqual(booked);
      expect(service.bookTrip).toHaveBeenCalledWith(input, userId);
    });
  });

  describe('updateTripStatus', () => {
    test('should update trip status', async () => {
      const id = 'trip1';
      const status = TripStatus.Booked;
      const userId = 'user123';
      const updated = { id, status };
      service.updateTripStatus = jest.fn(async () => updated);

      const result = await resolver.updateTripStatus(id, status, userId);
      expect(result).toEqual(updated);
      expect(service.updateTripStatus).toHaveBeenCalledWith(id, status, userId);
    });

    test('should throw if id is missing', async () => {
      await expect(resolver.updateTripStatus('', TripStatus.Cancelled, 'user123')).rejects.toThrow(
        new BadRequestException('Id is required'),
      );
    });

    test('should throw if status is invalid', async () => {
      await expect(
        resolver.updateTripStatus('trip1', 'WRONG_STATUS' as TripStatus, 'user123'),
      ).rejects.toThrow(new BadRequestException('Invalid status'));
    });
  });

  describe('deleteTrip', () => {
    test('should delete a trip', async () => {
      const id = 'trip1';
      const userId = 'user123';
      const deleted = { id };
      service.deleteTrip = jest.fn(async () => deleted);

      const result = await resolver.deleteTrip(id, userId);
      expect(result).toEqual(deleted);
      expect(service.deleteTrip).toHaveBeenCalledWith(id, userId);
    });

    test('should throw if id is missing', async () => {
      await expect(resolver.deleteTrip('', 'user123')).rejects.toThrow(
        new BadRequestException('Id is required'),
      );
    });
  });
});
