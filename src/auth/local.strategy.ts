import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const foundSession = await this.authService.validateSession(
      username,
      password,
    );
    if (!foundSession) {
      throw new UnauthorizedException('worng session name or password');
    }
    return foundSession;
  }
}
