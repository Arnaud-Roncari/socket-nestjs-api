import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { LoggedDto } from './dto/logged';
import { SignedDto } from './dto/signed.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const accessToken = await this.authService.login(dto);
    return new LoggedDto(accessToken);
  }

  @Post('/signup')
  async signup(@Body() dto: SignupDto) {
    const accessToken = await this.authService.signup(dto);
    return new SignedDto(accessToken);
  }
}
