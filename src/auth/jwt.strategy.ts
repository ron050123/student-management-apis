import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret',
    });
  }

  async validate(payload: any) {
    console.log("Decoded Payload:", payload);
    console.log('Payload role:', payload.role);
    const user = await this.userService.findUserById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}