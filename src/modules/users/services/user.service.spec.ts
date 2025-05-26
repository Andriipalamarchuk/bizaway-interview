import { UserService } from './user.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { CreateUserInput } from 'src/modules/auth/inputs/create-user.input';

describe('UserService', () => {
  let service: UserService;
  let userRepository: any;

  beforeEach(() => {
    userRepository = {};

    service = new UserService(userRepository);
  });

  describe('getUser', () => {
    test('should return user if userId matches or is not admin', async () => {
      const mockUser = { id: '123', email: 'test@example.com' } as UserModel;
      (service as any).findOne = jest.fn(async () => mockUser);

      const result = await service.getUser(mockUser.id!, false, mockUser.email);

      expect(result).toEqual(mockUser);
      expect((service as any).findOne).toHaveBeenCalledWith({
        id: undefined,
        email: mockUser.email,
      });
    });

    test('should throw ForbiddenException if userId mismatch and isAdmin is true', async () => {
      const mockUser = { id: '456', email: 'test@example.com' } as UserModel;
      (service as any).findOne = jest.fn(async () => mockUser);

      await expect(service.getUser('123', true, 'test@example.com')).rejects.toThrow(
        new ForbiddenException('Not Authorized'),
      );
    });
  });

  describe('getAllUsers', () => {
    test('should return all users from repository', async () => {
      const users = [{ email: 'a@example.com' }] as UserModel[];
      userRepository.getAllUsers = jest.fn(async () => users);

      const result = await service.getAllUsers();

      expect(result).toEqual(users);
    });
  });

  describe('findOneById', () => {
    test('should return user by id', async () => {
      const mockUser = { id: '1' } as UserModel;
      (service as any).findOne = jest.fn(async () => mockUser);

      const result = await service.findOneById('1');

      expect(result).toEqual(mockUser);
      expect((service as any).findOne).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('findOneByEmail', () => {
    test('should return user by email', async () => {
      const mockUser = { email: 'test@example.com' } as UserModel;
      (service as any).findOne = jest.fn(async () => mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect((service as any).findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('create', () => {
    test('should create and return new user', async () => {
      const input: CreateUserInput = {
        email: 'new@example.com',
        password: 'hashedpass',
        firstName: 'New',
        lastName: 'User',
      };

      const newUser = { ...input, id: 'abc123', isAdmin: false, isEnabled: true } as UserModel;
      userRepository.create = jest.fn(async () => newUser);

      const result = await service.create(input);

      expect(result).toEqual(newUser);
      expect(userRepository.create).toHaveBeenCalledWith(input);
    });
  });

  describe('getUserCredentialsByEmail', () => {
    test('should return user credentials if exists', async () => {
      const credentials = {
        email: 'a@example.com',
        password: 'hashed',
        isEnabled: true,
        id: 'id',
      };
      userRepository.getUserCredentials = jest.fn(async () => credentials);

      const result = await service.getUserCredentialsByEmail(credentials.email);

      expect(result).toEqual(credentials);
      expect(userRepository.getUserCredentials).toHaveBeenCalledWith(credentials.email);
    });

    test('should throw ForbiddenException if no credentials found', async () => {
      userRepository.getUserCredentials = jest.fn(async () => null);

      await expect(service.getUserCredentialsByEmail('notfound@example.com')).rejects.toThrow(
        new ForbiddenException('Not Authorized'),
      );
    });
  });

  describe('findOne (private)', () => {
    test('should throw BadRequestException for missing parameters', async () => {
      await expect((service as any).findOne({})).rejects.toThrow(
        new BadRequestException('Invalid params. At least email or id should be provided'),
      );
    });

    test('should return user if found', async () => {
      const mockUser = { id: '1' } as UserModel;
      userRepository.findOne = jest.fn(async () => mockUser);

      const result = await (service as any).findOne({ id: '1' });

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    test('should throw NotFoundException if user not found', async () => {
      userRepository.findOne = jest.fn(async () => null);

      await expect((service as any).findOne({ id: '1' })).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });
});
