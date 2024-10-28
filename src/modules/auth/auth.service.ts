import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/users.service';
import { JwtPayload, SignInDto } from './auth.dto';
import { ChangePasswordDto, CreateUserDto } from '../user/user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async signIn(body: SignInDto) {
    const user = await this.usersService.findOneByEmail(body.email);
    if (!user) throw new BadRequestException('user not found');

    const equal = await bcrypt.compare(body.password, user.password);
    if (!equal) throw new UnauthorizedException('Invalid password or email');
    
    const { password, ...rest } = user;

    const tokens = await this.generateTokens(rest);

    return tokens;
  }

  async signUp(body: CreateUserDto) {
    return await this.usersService.create(body);
  }

  async changePassword(body: ChangePasswordDto, user: JwtPayload) {
    const foundUser = await this.usersService.findOneByEmail(user.email);
    const equal = await bcrypt.compare(body.oldPassword, foundUser.password);
    if (!equal) throw new BadRequestException('wrong old password');

    await this.usersService.updatePassword(foundUser.id, body.newPassword);

    return { success: true };
  }

  async signOut(user: JwtPayload) {
    await this.setTokenBlackList(user.accessTokenId);
    await this.redis.del(`refreshToken:${user.id}`);

    return { msg: 'signed out' };
  }

  async refresh(refreshToken: string, accessToken: string) {
    const oldAccessTokenPayload = await this.jwtService.decode(accessToken);
    const cachedRefreshToken = await this.redis.get(
      `refreshToken:${oldAccessTokenPayload.id}`,
    );

    if (!cachedRefreshToken || cachedRefreshToken !== refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    await this.setTokenBlackList(oldAccessTokenPayload.accessTokenId);

    const newTokens = await this.generateTokens(oldAccessTokenPayload);

    return newTokens;
  }

  private saveRefreshToken = async (refreshToken, user) => {
    await this.redis.set(
      `refreshToken:${user.id}`,
      refreshToken,
      'EX',
      60 * 10, //10 минут
    );
  };

  private generateTokens = async (payload) => {
    const accessTokenId = uuid();
    const { exp, iat, ...purePayload } = payload;

    const accessToken = await this.jwtService.signAsync(
      { ...purePayload, accessTokenId },
      {
        secret: process.env.JWT_KEY,
        expiresIn: '2m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(purePayload, {
      secret: process.env.REFRESH_KEY,
      expiresIn: '10m',
    });

    await this.saveRefreshToken(refreshToken, purePayload);

    return { accessToken, refreshToken };
  };

  private setTokenBlackList = async (accessTokenId: string) => {
    await this.redis.set(
      `blacklist:${accessTokenId}`,
      accessTokenId,
      'EX',
      60 * 60 * 24 * 10,
    ); // 10 дней
  };
}
