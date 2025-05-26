import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserInput } from '../../auth/inputs/create-user.input';
import { UserModel } from '../models/user.model';
import { IUserCredentials } from '../interfaces/user-credentials.interface';

export class UserRepository {
  constructor(
    @InjectModel('User')
    private readonly _userModel: Model<User>,
  ) {}

  public async getAllUsers(): Promise<UserModel[]> {
    const findResult: UserDocument[] = await this._userModel.find().exec();
    return findResult.map((user) => this.mapUserSchemaToUserModel(user));
  }

  public async create(createUserInput: CreateUserInput): Promise<UserModel> {
    const createResult = await this._userModel.create({ ...createUserInput, isEnabled: true });
    return this.mapUserSchemaToUserModel(createResult);
  }

  public async findOne(findParams: { email?: string; id?: string }): Promise<UserModel | null> {
    const findResult = await this._userModel.findOne({
      email: findParams.email,
      id: findParams.id,
    });
    if (!findResult) {
      return null;
    }
    return this.mapUserSchemaToUserModel(findResult);
  }

  public async getUserCredentials(email: string): Promise<IUserCredentials | null> {
    const result = await this._userModel
      .findOne({ email })
      .select({ _id: true, email: true, password: true, isEnabled: true, isAdmin: true })
      .exec();
    if (!result) {
      return null;
    }

    return {
      id: result._id as unknown as string,
      password: result.password,
      email: result.email,
      isEnabled: result.isEnabled,
      isAdmin: result.isAdmin,
    };
  }

  private mapUserSchemaToUserModel(user: UserDocument): UserModel {
    return new UserModel(
      user._id as string,
      user.email,
      user.firstName,
      user.lastName,
      user.isEnabled,
      user.isAdmin,
    );
  }
}
