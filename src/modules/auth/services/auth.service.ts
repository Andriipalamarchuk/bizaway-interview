import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EncryptionService } from '../../encryption/services/encryption.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/user.service';
import { LoginResultModel } from '../models/login-result.model';
import { LoginInput } from '../inputs/login.input';
import { CreateUserInput } from '../inputs/create-user.input';
import { UserModel } from '../../users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _encryptionService: EncryptionService,
    private readonly _jwtService: JwtService,
  ) {}

  public async login(loginInput: LoginInput): Promise<LoginResultModel> {
    const userCredentials = await this._userService.getUserCredentialsByEmail(loginInput.email);
    const passwordMatch = await this._encryptionService.compareHash(
      loginInput.password,
      userCredentials.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!userCredentials.isEnabled) {
      throw new ForbiddenException('User is disabled. Contact admin');
    }
    const userId = userCredentials.id;

    return new LoginResultModel(
      userId,
      this._jwtService.sign({ userId, isAdmin: userCredentials.isAdmin }),
      userCredentials.isAdmin,
    );
  }

  public async register(createUserInput: CreateUserInput): Promise<UserModel> {
    try {
      await this._userService.findOneByEmail(createUserInput.email);
    } catch {
      const hashedPassword = await this._encryptionService.getHash(createUserInput.password);
      return await this._userService.create({
        ...createUserInput,
        password: hashedPassword,
      });
    }
    throw new ConflictException('User is already existing');
  }
}
