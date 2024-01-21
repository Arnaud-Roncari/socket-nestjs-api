import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsEmail()
  readonly username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string;
}
