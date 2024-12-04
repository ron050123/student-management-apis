import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { GqlAuthGuard } from './gql-auth.guard';

@Module({
    imports: [
      UserModule,
      PassportModule,
      JwtModule.register({
        secret: 'your_jwt_secret',
        signOptions: { expiresIn: '60m' },
      }),
    ],
    providers: [AuthService, AuthResolver, JwtStrategy, GqlAuthGuard],
  })
  export class AuthModule {}