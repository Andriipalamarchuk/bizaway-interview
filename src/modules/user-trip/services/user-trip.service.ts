import { Injectable, NotFoundException } from '@nestjs/common';
import { UserTripModel } from '../models/user-trip.model';
import { UserTripRepository } from '../repositories/user-trip.repository';
import { BookTripInput } from '../inputs/book-trip.input';
import { TripStatus } from '../enums/trip-status.enum';
import { Cacheable, CacheClear } from '@type-cacheable/core';
import { HashKey } from '../../../enums/hash-key.enum';
import { TimeInSecond } from '../../../enums/time-in-seconds.enum';

@Injectable()
export class UserTripService {
  constructor(private readonly _userTripRepository: UserTripRepository) {}

  @Cacheable({
    hashKey: HashKey.TRIP_USER,
    cacheKey: (args: any[]) => `${args[0]}`,
    ttlSeconds: TimeInSecond.ONE_DAY,
  })
  public async getAllTrips(currentUserId: string): Promise<UserTripModel[]> {
    return await this._userTripRepository.getAllTrips(currentUserId);
  }

  @Cacheable({
    hashKey: HashKey.TRIP_USER_BY_ID,
    cacheKey: (args: any[]) => `${args[1]}`,
    ttlSeconds: TimeInSecond.ONE_DAY,
  })
  public async getTrip(currentUserId: string, id: string): Promise<UserTripModel> {
    const trip = await this._userTripRepository.getTrip(id, currentUserId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  @CacheClear({
    hashKey: HashKey.TRIP_USER,
    cacheKey: (args: any[]) => `${args[1]}`,
  })
  public async bookTrip(input: BookTripInput, userId: string) {
    return await this._userTripRepository.bookTrip(input, userId);
  }

  @CacheClear({
    hashKey: HashKey.TRIP_USER_BY_ID,
    cacheKey: (args: any[]) => `${args[0]}`,
  })
  @CacheClear({
    hashKey: HashKey.TRIP_USER,
    cacheKey: (args: any[]) => `${args[2]}`,
  })
  public async updateTripStatus(
    id: string,
    newStatus: TripStatus,
    userId: string,
  ): Promise<UserTripModel> {
    // Check if a trip exists and the user has permissions
    await this.getTrip(userId, id);
    await this._userTripRepository.updateTripStatus(id, newStatus);

    return await this.getTrip(userId, id);
  }

  @CacheClear({
    hashKey: HashKey.TRIP_USER,
    cacheKey: (args: any[]) => `${args[1]}`,
  })
  public async deleteTrip(id: string, userId: string): Promise<UserTripModel> {
    const trip = await this.getTrip(userId, id);
    await this._userTripRepository.deleteTrip(id);
    return trip;
  }
}
