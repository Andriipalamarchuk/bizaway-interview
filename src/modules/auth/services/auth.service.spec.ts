import { AuthService } from './auth.service';
import { ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from '../inputs/create-user.input';
import { LoginInput } from '../inputs/login.input';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: any;
  let encryptionService: any;
  let jwtService: any;

  beforeEach(() => {
    userService = {};

    encryptionService = {};

    jwtService = {};

    authService = new AuthService(userService, encryptionService, jwtService);
  });

  describe('login', () => {
    const loginInput: LoginInput = {
      email: 'test@example.com',
      password: 'plaintext',
    };

    test('should return JWT and user info on valid credentials', async () => {
      const user = {
        _id: 'user123',
        password: 'hashedPassword',
        isEnabled: true,
        isAdmin: false,
      };

      userService.getUserCredentialsByEmail = jest.fn(async () => user);
      encryptionService.compareHash = jest.fn(async () => true);
      jwtService.sign = jest.fn(() => 'signed-jwt');

      const result = await authService.login(loginInput);

      expect(result).toEqual({ userId: 'user123', accessToken: 'signed-jwt', isAdmin: false });
      expect(userService.getUserCredentialsByEmail).toHaveBeenCalledWith(loginInput.email);
      expect(encryptionService.compareHash).toHaveBeenCalledWith(
        loginInput.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: user._id, isAdmin: user.isAdmin });
    });

    test('should throw UnauthorizedException on password mismatch', async () => {
      const user = {
        _id: 'user123',
        password: 'hashedPassword',
        isEnabled: true,
        isAdmin: false,
      };
      userService.getUserCredentialsByEmail = jest.fn(async () => user);
      encryptionService.compareHash = jest.fn(async () => false);

      await expect(authService.login(loginInput)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    test('should throw ForbiddenException if user is disabled', async () => {
      const user = {
        _id: 'user123',
        password: 'hashedPassword',
        isEnabled: false,
        isAdmin: false,
      };
      userService.getUserCredentialsByEmail = jest.fn(async () => user);
      encryptionService.compareHash = jest.fn(async () => true);

      await expect(authService.login(loginInput)).rejects.toThrow(
        new ForbiddenException('User is disabled. Contact admin'),
      );
    });
  });

  describe('register', () => {
    const createUserInput: CreateUserInput = {
      email: 'new@example.com',
      password: 'plaintext',
      firstName: 'Test',
      lastName: 'User',
    };

    test('should create user if email is not found', async () => {
      userService.findOneByEmail = jest.fn(async () => {
        throw new Error('User not found');
      });
      encryptionService.getHash = jest.fn(async () => 'hashedPassword');
      const userToCreate = {
        ...createUserInput,
        password: 'hashedPassword',
        id: 'newId',
      };
      userService.create = jest.fn(async () => userToCreate);

      const result = await authService.register(createUserInput);
      expect(result).toEqual(userToCreate);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(createUserInput.email);
      expect(userService.create).toHaveBeenCalledWith({
        ...createUserInput,
        password: 'hashedPassword',
      });
    });

    test('should throw ConflictException if user already exists', async () => {
      userService.findOneByEmail = jest.fn(async () => createUserInput);

      await expect(authService.register(createUserInput)).rejects.toThrow(
        new ConflictException('User is already existing'),
      );
    });
  });
});
