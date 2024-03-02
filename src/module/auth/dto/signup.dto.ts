import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class SignupDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly fcm_token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string;
}
