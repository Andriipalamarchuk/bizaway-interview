import { CreateUserInput } from '../inputs/create-user.input';
import { AuthResolver } from './auth.resolver';
import { UserModel } from '../../users/models/user.model';
import { LoginInput } from '../inputs/login.input';
import { LoginResultModel } from '../models/login-result.model';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: any;

  beforeEach(() => {
    authService = {};

    resolver = new AuthResolver(authService);
  });

  describe('register', () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      password: 'test123',
      firstName: 'John',
      lastName: 'Doe',
    };

    test('should call authService.register and return a UserModel', async () => {
      const userModel: UserModel = {
        id: '123',
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        isEnabled: false,
        isAdmin: false,
      };

      authService.register = jest.fn(async () => userModel);

      const result = await resolver.register(input);

      expect(authService.register).toHaveBeenCalledWith(input);
      expect(result).toEqual(userModel);
    });
  });

  describe('login', () => {
    const input: LoginInput = {
      email: 'test@example.com',
      password: 'test123',
    };

    test('should call authService.login and return a LoginResultModel', async () => {
      const loginResult: LoginResultModel = {
        userId: '123',
        accessToken: 'jwt-token',
        isAdmin: false,
      };

      authService.login = jest.fn(async () => loginResult);

      const result = await resolver.login(input);

      expect(authService.login).toHaveBeenCalledWith(input);
      expect(result).toEqual(loginResult);
    });
  });
});
