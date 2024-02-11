import {
  Logger,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';
import { JwtContent } from 'src/common/types/jwt-content';
import { GatewayAuthGuard } from 'src/common/guards/gateway-auth.guard';
import { GatewayIdFromJWT } from 'src/common/decorators/gateway-id-from-jwt.decorator';
import { ChatMapper } from './mapper/chat.mapper';
import { CreateChatDto } from './dto/create_chat.dto';
import { WsRequestException } from 'src/common/types/ws-request-exception';
import { WebSocketResponse } from 'src/common/types/ws-response';
import { TypingDto } from './dto/typing.dto';

@UsePipes(new ValidationPipe({ whitelist: true, disableErrorMessages: false }))
@UseFilters(WsExceptionFilter)
@UseGuards(GatewayAuthGuard)
@WebSocketGateway({ namespace: 'user' })
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(UserGateway.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer() io: Namespace;
  // Database id to socket client id
  clients = new Map<string, string>();

  afterInit(): void {
    this.logger.log('Websocket created');
  }

  // handleConnection does not support UserGuards.
  // But other events does.
  // So we implement the same logic as AuthGuard.
  // Which consist to verify if a JWT is provided.
  // For this purpose, it is enough.
  // For production applications, the verification should be made before allowing the connection.
  async handleConnection(client: Socket) {
    try {
      const [type, token] =
        client.handshake.headers['authorization']?.split(' ') ?? [];
      token == 'Bearer' ? token : null;
      if (!token) {
        throw new UnauthorizedException();
      }
      const payload: JwtContent = this.jwtService.verify(token);
      // Link socket id to the user.
      this.clients.set(payload.id, client.id);
      // Connect client to all his chats room.
      const userId = payload.id;
      const chats = await this.chatService.getChats(userId);
      await client.join(chats.map((chat) => chat.id));

      // Notify related rooms that a new user is connected
      this.io
        .to(chats.map((chat) => chat.id))
        .emit('connected-user', ChatMapper.toConnectedUserDto(userId));

      // Notify client which user from his chats are connected.
      const userIds: string[] = [];
      for (let chat of chats) {
        for (let user of chat.users) {
          if (user.id != userId && this.clients.has(user.id)) {
            userIds.push(user.id);
          }
        }
      }
      this.io
        .to(client.id)
        .emit('connected-users', ChatMapper.toConnectedUsersDto(userIds));
    } catch (exception) {
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    let userId: string;
    // Remove client from map.
    for (const [key, value] of this.clients) {
      if (value == client.id) {
        userId = key;
        this.clients.delete(key);
        break;
      }
    }
    // Notify related users that a the user is disconnected
    const chats = await this.chatService.getChats(userId);
    this.io
      .to(chats.map((chat) => chat.id))
      .emit('disconnected-user', ChatMapper.toDisconnectedUser(userId));
  }

  @SubscribeMessage('create-message')
  async createMessage(
    @MessageBody() dto: CreateMessageDto,
    @GatewayIdFromJWT() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { request_uuid } = dto;
      const message = await this.chatService.createMessage(
        dto,
        userId,
        dto.request_uuid,
      );
      /// Notify the sender that the chat has been created.
      this.io
        .to(client.id)
        .emit(
          'create-message-response',
          new WebSocketResponse(
            true,
            request_uuid,
            ChatMapper.toCreatedMessageDto(message, dto.chat_id),
          ),
        );
      // Notify that a message whas created to room
      this.io
        .to(dto.chat_id)
        .emit(
          'new-message',
          ChatMapper.toCreatedMessageDto(message, dto.chat_id),
        );
    } catch (exception) {
      if (exception instanceof WsRequestException) {
        this.io
          .to(client.id)
          .emit(
            'create-message-response',
            new WebSocketResponse(
              false,
              exception.request_uuid,
              exception.getError(),
            ),
          );
      } else {
        // Store error in database ...
      }
    }
  }

  @SubscribeMessage('typing')
  async onTyping(
    @MessageBody() dto: TypingDto,
    @GatewayIdFromJWT() userId: string,
  ) {
    const chats = await this.chatService.getChats(userId);
    // Notify related rooms that someone is typing
    this.io
      .to(chats.map((chat) => chat.id))
      .emit(
        'user-typing',
        ChatMapper.toUserTyping(dto.is_typing, dto.chat_id, userId),
      );
  }

  @SubscribeMessage('create-chat')
  async createChat(
    @MessageBody() dto: CreateChatDto,
    @GatewayIdFromJWT() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { request_uuid } = dto;
      const chat = await this.chatService.createChat(
        [userId, dto.user_id],
        request_uuid,
      );
      /// Notify the sender that the chat has been created.
      this.io
        .to(client.id)
        .emit(
          'create-chat-response',
          new WebSocketResponse(true, request_uuid, ChatMapper.toChatDto(chat)),
        );

      /// Emit to related users that a chat has been created.
      for (let user of chat.users) {
        if (this.clients.has(user.id)) {
          // Join the new chat rooms
          let socketId = this.clients.get(user.id);
          this.io.sockets.get(socketId).join(chat.id);
          // Notify a new chat has been created
          this.io.to(socketId).emit('new-chat', ChatMapper.toChatDto(chat));
        }
      }
    } catch (exception) {
      if (exception instanceof WsRequestException) {
        this.io
          .to(client.id)
          .emit(
            'create-chat-response',
            new WebSocketResponse(
              false,
              exception.request_uuid,
              exception.getError(),
            ),
          );
      } else {
        // Store error in database ...
      }
    }
  }
}