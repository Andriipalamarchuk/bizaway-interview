import { UserModel } from '../models/user.model';
import { UserResolver } from './user.resolver';
import { BadRequestException } from '@nestjs/common';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: any;

  beforeEach(() => {
    userService = {};

    resolver = new UserResolver(userService);
  });

  describe('users', () => {
    test('should return all users from service', async () => {
      const mockUsers: UserModel[] = [
        {
          _id: '1',
          email: 'a@example.com',
          firstName: 'A',
          lastName: 'B',
          isEnabled: true,
          isAdmin: false,
        },
      ];

      userService.getAllUsers = jest.fn(async () => mockUsers);

      const result = await resolver.users();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('user', () => {
    const userId = '123';
    const isAdmin = true;

    test('should throw error if neither email nor id is provided', async () => {
      await expect(resolver.user(userId, isAdmin)).rejects.toThrow(
        new BadRequestException('Email or id should be provided'),
      );
    });

    test('should return user by email', async () => {
      const mockUser: UserModel = {
        _id: '1',
        email: 'a@example.com',
        firstName: 'Test',
        lastName: 'User',
        isEnabled: true,
        isAdmin: false,
      };
      const email = 'A@Example.com';

      userService.getUser = jest.fn(async () => mockUser);

      const result = await resolver.user(userId, isAdmin, email);

      expect(userService.getUser).toHaveBeenCalledWith(userId, isAdmin, 'a@example.com', undefined);
      expect(result).toEqual(mockUser);
    });

    test('should return user by id', async () => {
      const mockUser: UserModel = {
        _id: '1',
        email: 'b@example.com',
        firstName: 'Test',
        lastName: 'User',
        isEnabled: true,
        isAdmin: false,
      };
      const id = '1';

      userService.getUser = jest.fn(async () => mockUser);

      const result = await resolver.user(userId, isAdmin, undefined, id);

      expect(userService.getUser).toHaveBeenCalledWith(userId, isAdmin, undefined, id);
      expect(result).toEqual(mockUser);
    });
  });
});
