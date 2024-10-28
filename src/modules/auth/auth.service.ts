import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload, SignInDto } from './auth.dto';
import { ChangePasswordDto, CreateUserDto } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRedis() private readonly redis: Redis,
    ) { }

    async signIn(body: SignInDto) {
        const user = await this.usersService.findOneByEmail(body.email);
        if (!user) throw new BadRequestException('user not found');

        if (!bcrypt.compare(body.password, user.password))
            throw new UnauthorizedException();

        const { password, ...rest } = user;

        const accessToken = await this.generateAccessToken(rest);

        const refreshToken = await this.jwtService.signAsync(rest, {
            secret: process.env.REFRESH_KEY,
            expiresIn: 180,
        });

        await this.saveRefreshToken(refreshToken, rest);

        return { accessToken, refreshToken };
    }

    async signUp(body: CreateUserDto) {
        return await this.usersService.create(body);
    }

    async changePassword(body: ChangePasswordDto, user: JwtPayload) {
        const foundUser = await this.usersService.findOneByEmail(user.email)
        if (!bcrypt.compare(body.oldPassword, foundUser.password))
            throw new BadRequestException('wrong old password');

        return await this.usersService.updatePassword(foundUser.id, body.newPassword);
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

        console.log(cachedRefreshToken)
        if (!cachedRefreshToken || cachedRefreshToken != refreshToken)
            throw new UnauthorizedException('Invalid refresh token');

        await this.setTokenBlackList(oldAccessTokenPayload.accessTokenId);

        const newAccessToken = await this.generateAccessToken(
            oldAccessTokenPayload,
        );

        return { accessToken: newAccessToken };
    }

    private saveRefreshToken = async (refreshToken, user) => {
        await this.redis.set(
            `refreshToken:${user.id}`,
            refreshToken,
            'EX',
            1000 * 180,
        );
    };

    private generateAccessToken = async (payload) => {
        const accessTokenId = uuid();
        const { exp, iat, ...purePayload } = payload;

        console.log(purePayload);
        const accessToken = await this.jwtService.signAsync(
            { ...purePayload, accessTokenId },
            {
                secret: process.env.JWT_KEY,
                expiresIn: '1d',
            },
        );

        return accessToken;
    };

    private setTokenBlackList = async (accessTokenId: string) => {
        await this.redis.set(
            `blacklist:${accessTokenId}`,
            accessTokenId,
            'EX',
            60 * 60 * 1000 * 24 * 10,
        ); // 10 дней
    };
}