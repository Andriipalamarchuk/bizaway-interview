import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from '../../auth/inputs/create-user.input';
import { UserRepository } from '../repositories/user.repository';
import { UserModel } from '../models/user.model';
import { IUserCredentials } from '../interfaces/user-credentials.interface';
import { HashKey } from '../../../enums/hash-key.enum';
import { TimeInSecond } from '../../../enums/time-in-seconds.enum';
import { Cacheable, CacheClear } from '@type-cacheable/core';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  public async getUser(
    currentUserId: string,
    isAdmin: boolean,
    email?: string,
    id?: string,
  ): Promise<UserModel> {
    const user = await this.findOne({ email, id });
    if (user._id !== currentUserId && isAdmin) {
      throw new ForbiddenException('Not Authorized');
    }

    return user;
  }

  @Cacheable({
    hashKey: HashKey.USERS,
    ttlSeconds: TimeInSecond.ONE_DAY,
  })
  public async getAllUsers() {
    return await this._userRepository.getAllUsers();
  }

  @Cacheable({
    hashKey: HashKey.USER_BY_ID,
    cacheKey: (args: any[]) => `${args[0]}`,
    ttlSeconds: TimeInSecond.ONE_DAY,
  })
  public async findOneById(id: string) {
    return await this.findOne({ id });
  }

  @Cacheable({
    hashKey: HashKey.USER_BY_EMAIL,
    cacheKey: (args: any[]) => `${args[0]}`,
    ttlSeconds: TimeInSecond.ONE_DAY,
  })
  public async findOneByEmail(email: string): Promise<UserModel> {
    return await this.findOne({ email });
  }

  @CacheClear({
    hashKey: HashKey.USERS,
  })
  public async create(createUserInput: CreateUserInput): Promise<UserModel> {
    return await this._userRepository.create(createUserInput);
  }

  @Cacheable({
    hashKey: HashKey.USER_CREDENTIALS,
    cacheKey: (args: any[]) => `${args[0]}`,
    ttlSeconds: TimeInSecond.ONE_DAY,
  })
  public async getUserCredentialsByEmail(email: string): Promise<IUserCredentials> {
    const credentials = await this._userRepository.getUserCredentials(email);
    if (!credentials) {
      throw new ForbiddenException('Not Authorized');
    }

    return credentials;
  }

  @Cacheable({
    hashKey: HashKey.USER_FIND_ONE,
    cacheKey: (args: any[]) => `${JSON.stringify(args[0])}`,
    ttlSeconds: TimeInSecond.ONE_DAY,
  })
  private async findOne(findParams: { email?: string; id?: string }): Promise<UserModel> {
    const user = await this._userRepository.findOne(findParams);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
