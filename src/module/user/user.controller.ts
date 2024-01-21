import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IdFromJWT } from 'src/common/decorators/id-from-jwt.decorator';
import { UserMapper } from './user.mapper';
import { UserDto } from './dto/user.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async getAllUsers(@IdFromJWT() userId: string): Promise<UserDto[]> {
    const users = await this.userService.getAllUsers(userId);
    return UserMapper.toUsersDto(users);
  }

  @Get()
  async getUser(@IdFromJWT() userId: string) {
    const user = await this.userService.getUser(userId);
    return UserMapper.toUserDto(user);
  }
}
