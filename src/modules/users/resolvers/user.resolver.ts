import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { RouteEnum } from '../../../enums/route.enum';
import { CurrentUserId } from '../../../decorators/current-user-id.decorator';
import { IsAdmin } from '../../../decorators/is-admin.decorator';
import { AdminGuard } from '../../auth/guards/admin.guard';

@Resolver(RouteEnum.User)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  //TODO: Implement pagination
  @UseGuards(AdminGuard)
  @Query(() => [UserModel])
  public async users(): Promise<UserModel[]> {
    return await this._userService.getAllUsers();
  }

  @Query(() => UserModel)
  public async user(
    @CurrentUserId() currentUserId: string,
    @IsAdmin() isAdmin: boolean,
    @Args('email', { nullable: true }) email?: string,
    @Args('id', { type: () => Int, nullable: true }) id?: string,
  ): Promise<UserModel> {
    if (!email && !id) {
      throw new BadRequestException('Email or id should be provided');
    }
    return await this._userService.getUser(
      currentUserId,
      isAdmin,
      email ? email.toLowerCase().trim() : email,
      id,
    );
  }
}
