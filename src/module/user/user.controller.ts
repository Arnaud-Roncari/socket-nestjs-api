import {
  Controller,
  Get,
  Param,
  UseGuards,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IdFromJWT } from 'src/common/decorators/id-from-jwt.decorator';
import { UserMapper } from './mapper/user.mapper';
import { UserDto } from './dto/user.dto';
import { ChatService } from '../chat/chat.service';
import { ChatDto } from './dto/chat.dto';
import { ChatMapper } from './mapper/chat.mapper';
import { createReadStream } from 'fs';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

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

  @Get('/chat/all')
  async getChats(@IdFromJWT() userId: string): Promise<ChatDto[]> {
    const chats = await this.chatService.getChats(userId);
    return ChatMapper.toChatsDto(chats);
  }

  @Get('/picture/:id')
  @Header('Content-type', 'image/png')
  getPicture(@Param('id') id: string): StreamableFile {
    const file = createReadStream(`assets/${id}.png`);
    return new StreamableFile(file);
  }
}
