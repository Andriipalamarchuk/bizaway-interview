import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserInput } from '../../auth/inputs/create-user.input';
import { UserModel } from '../models/user.model';
import { BadRequestException } from '@nestjs/common';
import { IUserCredentials } from '../interfaces/user-credentials.interface';

export class UserRepository {
  constructor(
    @InjectModel('User')
    private readonly _userModel: Model<User>,
  ) {}

  public async getAllUsers(): Promise<UserModel[]> {
    return await this._userModel.find().exec();
  }

  public async create(createUserInput: CreateUserInput): Promise<UserModel> {
    return await this._userModel.create({ ...createUserInput, isEnabled: true });
  }

  public async findOne(findParams: { email?: string; id?: string }): Promise<UserModel | null> {
    if (!findParams.email && !findParams.id) {
      throw new BadRequestException('Invalid params. At least email or id should be provided');
    }

    return await this._userModel.findOne({ email: findParams.email, id: findParams.id });
  }

  public async getUserCredentials(email: string): Promise<IUserCredentials | null> {
    return await this._userModel
      .findOne({ email })
      .select({ _id: true, email: true, password: true, isEnabled: true, isAdmin: true })
      .exec();
  }
}
