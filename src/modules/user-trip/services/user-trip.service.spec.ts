import { TripStatus } from '../enums/trip-status.enum';
import { UserTripService } from './user-trip.service';
import { NotFoundException } from '@nestjs/common';
import { BookTripInput } from '../inputs/book-trip.input';

describe('UserTripService', () => {
  let service: UserTripService;
  let repository: any;

  beforeEach(async () => {
    repository = {};
    service = new UserTripService(repository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getAllTrips', () => {
    it('should return all trips for the user', async () => {
      const trips = [{ id: '1' }, { id: '2' }];
      repository.getAllTrips = jest.fn(async () => trips);

      const result = await service.getAllTrips('user123');
      expect(result).toEqual(trips);
      expect(repository.getAllTrips).toHaveBeenCalledWith('user123');
    });
  });

  describe('getTrip', () => {
    it('should return a trip if it exists', async () => {
      const trip = { id: 'trip1' };
      repository.getTrip = jest.fn(async () => trip);

      const result = await service.getTrip('user123', 'trip1');
      expect(result).toEqual(trip);
      expect(repository.getTrip).toHaveBeenCalledWith('trip1', 'user123');
    });

    it('should throw if trip is not found', async () => {
      repository.getTrip = jest.fn(async () => null);

      await expect(service.getTrip('user123', 'trip1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('bookTrip', () => {
    it('should book a trip', async () => {
      const input: BookTripInput = { origin: 'LAX', destination: 'JFK' } as any;
      const resultTrip = { id: 'trip123' };
      repository.bookTrip = jest.fn(async () => resultTrip);

      const result = await service.bookTrip(input, 'user123');
      expect(result).toEqual(resultTrip);
      expect(repository.bookTrip).toHaveBeenCalledWith(input, 'user123');
    });
  });

  describe('updateTripStatus', () => {
    it('should update trip status and return updated trip', async () => {
      const trip = { id: 'trip1', status: TripStatus.Booked };
      repository.getTrip = jest.fn(async () => trip);
      repository.updateTripStatus = jest.fn(async () => undefined);
      repository.getTrip = jest.fn(async () => ({ id: 'trip1', status: TripStatus.Booked }));

      const result = await service.updateTripStatus('trip1', TripStatus.Booked, 'user123');
      expect(result).toEqual({ id: 'trip1', status: TripStatus.Booked });

      expect(repository.getTrip).toHaveBeenCalledWith('trip1', 'user123');
      expect(repository.updateTripStatus).toHaveBeenCalledWith('trip1', TripStatus.Booked);
    });
  });

  describe('deleteTrip', () => {
    it('should delete a trip and return the original trip', async () => {
      const trip = { id: 'trip1' };
      repository.getTrip = jest.fn(async () => trip);
      repository.deleteTrip = jest.fn(async () => undefined);

      const result = await service.deleteTrip('trip1', 'user123');
      expect(result).toEqual(trip);

      expect(repository.getTrip).toHaveBeenCalledWith('trip1', 'user123');
      expect(repository.deleteTrip).toHaveBeenCalledWith('trip1');
    });
  });
});
