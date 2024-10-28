import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class JwtPayload {
  id: string;
  email: string;
  accessTokenId: string;
}
