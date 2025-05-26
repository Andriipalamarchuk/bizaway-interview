import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RouteEnum } from '../../../enums/route.enum';
import { UserTripService } from '../services/user-trip.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { CurrentUserId } from '../../../decorators/current-user-id.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserTripModel } from '../models/user-trip.model';
import { BookTripInput } from '../inputs/book-trip.input';
import { TripStatus } from '../enums/trip-status.enum';

@UseGuards(JwtAuthGuard)
@Resolver(RouteEnum.UserTrip)
export class UserTripResolver {
  constructor(private readonly _userTripService: UserTripService) {}

  @Query(() => [UserTripModel])
  public async trips(@CurrentUserId() currentUserId: string): Promise<any[]> {
    return await this._userTripService.getAllTrips(currentUserId);
  }

  @Query(() => UserTripModel)
  public async trip(@CurrentUserId() currentUserId: string, @Args('id') id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    return await this._userTripService.getTrip(currentUserId, id);
  }

  @Mutation(() => UserTripModel)
  public async bookTrip(
    @Args('input') input: BookTripInput,
    @CurrentUserId() userId: string,
  ): Promise<UserTripModel> {
    return await this._userTripService.bookTrip(input, userId);
  }

  @Mutation(() => UserTripModel)
  public async updateTripStatus(
    @Args('id') id: string,
    @Args('status', { type: () => TripStatus }) newStatus: TripStatus,
    @CurrentUserId() userId: string,
  ): Promise<UserTripModel> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    if (Object.values(TripStatus).indexOf(newStatus) === -1) {
      throw new BadRequestException('Invalid status');
    }

    return await this._userTripService.updateTripStatus(id, newStatus, userId);
  }

  @Mutation(() => UserTripModel)
  public async deleteTrip(
    @Args('id') id: string,
    @CurrentUserId() userId: string,
  ): Promise<UserTripModel> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    return await this._userTripService.deleteTrip(id, userId);
  }
}
