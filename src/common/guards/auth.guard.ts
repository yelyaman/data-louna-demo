import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../../modules/auth/auth.dto';
import { Reflector } from '@nestjs/core';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { IS_PUBLIC_KEY } from '../decorators/ispublic.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler()
    ])

    if (isPublic) return true

    const request: Request = context.switchToHttp().getRequest();

    // Можно сделать что бы извлекалось из cookie
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') throw new UnauthorizedException();

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });

      const blackListed = await this.redis.get(
        `blacklist:${payload.accessTokenId}`,
      );
      
      if (blackListed)
        throw new UnauthorizedException('access token in black list');

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}