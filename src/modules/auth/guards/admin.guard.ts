import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly _userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const userId = request.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User should be logged in');
    }
    const user = await this._userService.findOneById(userId);
    return user.isAdmin;
  }
}
