import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../inputs/create-user.input';
import { LoginInput } from '../inputs/login.input';
import { LoginResultModel } from '../models/login-result.model';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../../users/models/user.model';
import { RouteEnum } from '../../../enums/route.enum';

@Resolver(RouteEnum.Auth)
export class AuthResolver {
  constructor(private readonly _authService: AuthService) {}

  @Mutation(() => UserModel)
  public async register(@Args('input') input: CreateUserInput): Promise<UserModel> {
    return await this._authService.register(input);
  }

  @Mutation(() => LoginResultModel)
  public async login(@Args('input') input: LoginInput): Promise<LoginResultModel> {
    return await this._authService.login(input);
  }
}
