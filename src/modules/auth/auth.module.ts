import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminGuard } from './guards/admin.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { EncryptionModule } from '../encryption/encryption.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../users/user.module';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';

@Global()
@Module({
  imports: [
    EncryptionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          secret: configService.get<string>('JWT_TOKEN'),
          signOptions: { expiresIn: '365d' },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    UserModule,
  ],
  providers: [JwtStrategy, AdminGuard, AuthResolver, AuthService],
  exports: [AdminGuard, AuthResolver],
})
export class AuthModule {}
