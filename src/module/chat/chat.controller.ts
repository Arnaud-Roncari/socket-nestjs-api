import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatService } from './chat.service';
import { IdFromJWT } from 'src/common/decorators/id-from-jwt.decorator';
import { ChatMapper } from './chat.mapper';
import { CreateChatDto } from './dto/create_chat.dto';
import { ChatDto } from './dto/chat.dto';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/all')
  async getChats(@IdFromJWT() userId: string): Promise<ChatDto[]> {
    const chats = await this.chatService.getChats(userId);
    return ChatMapper.toChatsDto(chats);
  }

  @Post('/create')
  async createChat(
    @IdFromJWT() userId: string,
    @Body() body: CreateChatDto,
  ): Promise<ChatDto> {
    const chat = await this.chatService.createChat([userId, body.user_id]);
    return ChatMapper.toChatDto(chat);
  }
}
