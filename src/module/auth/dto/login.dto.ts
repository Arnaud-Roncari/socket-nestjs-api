import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly fcm_token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string;
}
