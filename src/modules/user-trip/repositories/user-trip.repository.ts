import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTrip, UserTripDocument } from '../schemas/user-trip.schema';
import { BookTripInput } from '../inputs/book-trip.input';
import { TripStatus } from '../enums/trip-status.enum';
import { UserTripModel } from '../models/user-trip.model';

@Injectable()
export class UserTripRepository {
  constructor(
    @InjectModel('UserTrip')
    private readonly _userTripModel: Model<UserTrip>,
  ) {}

  public async getAllTrips(userId: string): Promise<UserTripModel[]> {
    const trips = await this._userTripModel.find({ user: userId }).populate('user').exec();
    return trips.map((trip) => this.mapUserTripSchemaToUserTripModel(trip));
  }

  public async getTrip(id: string, userId: string): Promise<UserTripModel | null> {
    const findResult = await this._userTripModel
      .findOne({ _id: id, user: userId })
      .populate('user')
      .exec();

    if (!findResult) {
      return null;
    }

    return this.mapUserTripSchemaToUserTripModel(findResult);
  }

  public async bookTrip(input: BookTripInput, userId: string) {
    const createResult = await this._userTripModel.create({
      ...input,
      status: TripStatus.Booked,
      user: userId,
    });
    return this.mapUserTripSchemaToUserTripModel(createResult);
  }

  public async updateTripStatus(id: string, newStatus: TripStatus): Promise<void> {
    await this._userTripModel.updateOne({ _id: id }, { status: newStatus });
  }

  public async deleteTrip(id: string): Promise<void> {
    await this._userTripModel.deleteOne({ _id: id });
  }

  private mapUserTripSchemaToUserTripModel(userTrip: UserTripDocument): UserTripModel {
    return new UserTripModel(
      userTrip._id as string,
      userTrip.origin,
      userTrip.destination,
      userTrip.cost,
      userTrip.duration,
      userTrip.status,
      userTrip.type,
      userTrip.displayName,
    );
  }
}
