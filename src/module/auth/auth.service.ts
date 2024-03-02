import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/module/user/user.schema';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtContent } from 'src/common/types/jwt-content';
import { UserNotFoundException } from 'src/common/errors/http/user-not-found';
import { InvalidPasswordException } from 'src/common/errors/http/invalid-password';
import { UserAlreadyExistException } from 'src/common/errors/http/user-already-exist';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<string> {
    const { username, password, fcm_token } = dto;
    const existingUser = await this.userModel.findOne({ username });

    if (!existingUser) {
      throw new UserNotFoundException();
    }
    const match = await argon2.verify(existingUser.password_hash, password);
    if (!match) {
      throw new InvalidPasswordException();
    }

    /// Update fmc_token, for notifications.
    await this.userModel.findByIdAndUpdate(existingUser.id, { fcm_token });

    return await this.jwtService.signAsync({
      id: existingUser._id.toString(),
    } as JwtContent);
  }

  async signup(dto: SignupDto): Promise<string> {
    const { username, password, fcm_token } = dto;
    const isUsername = await this.userModel.findOne({ username });

    if (isUsername) {
      throw new UserAlreadyExistException();
    }

    const passwordHash = await argon2.hash(password);
    const userCreated = await this.userModel.create({
      username,
      password_hash: passwordHash,
      fcm_token,
      avatar_number: Math.floor(Math.random() * 15) + 1,
    });
    return await this.jwtService.signAsync({
      id: userCreated._id.toString(),
    } as JwtContent);
  }
}
