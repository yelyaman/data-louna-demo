import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Headers,
  Patch,
} from '@nestjs/common';
import { SignInDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CreateUserDto } from '../user/user.dto';
import { Public } from '../../common/decorators/ispublic.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('info')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Patch('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(changePasswordDto, req.user);
  }

  @Public()
  @Get('refresh')
  async refresh(
    @Headers('authorization') authToken: string,
    @Headers('refresh-token') refreshToken: string,
  ) {
    const accessToken = authToken.split(' ')[1];
    return this.authService.refresh(refreshToken, accessToken);
  }

  @Get('signout')
  async signout(@Request() req) {
    await this.authService.signOut(req.user);
  }
}
