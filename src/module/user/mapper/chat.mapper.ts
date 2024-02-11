import { UserDto } from '../dto/user.dto';
import { ChatDto } from '../dto/chat.dto';
import { MessageDto } from '../dto/message.dto';
import { ChatEntity } from '../../chat/entity/chat.entity';
import { MessageEntity } from 'src/module/chat/entity/message.entity';
import { CreatedMessageDto } from '../dto/created-message.dto';
import { ConnectedUserDto } from '../dto/connected-user.dto';
import { DisconnectedUserDto } from '../dto/disconnected-user.dto';
import { ConnectedUsersDto } from '../dto/connected-users.dto';
import { UserTypingDto } from '../dto/user-typing.dto';

export class ChatMapper {
  static toChatDto(entity: ChatEntity): ChatDto {
    return new ChatDto({
      chat_id: entity.id,
      users: entity.users.map(
        (user) =>
          new UserDto({
            id: user.id,
            username: user.username,
            avatar_number: user.avatarNumber,
          }),
      ),
      messages: entity.messages.map(
        (message) =>
          new MessageDto({
            user_id: message.userId,
            text: message.text,
            created_at: message.createdAt,
          }),
      ),
    });
  }

  static toChatsDto(entities: ChatEntity[]): ChatDto[] {
    let chatsDto: ChatDto[] = [];
    for (let entity of entities) {
      chatsDto.push(this.toChatDto(entity));
    }
    return chatsDto;
  }

  static toCreatedMessageDto(
    entity: MessageEntity,
    chatId: string,
  ): CreatedMessageDto {
    return new CreatedMessageDto({
      chat_id: chatId,
      created_at: entity.createdAt,
      text: entity.text,
      user_id: entity.userId,
    });
  }

  static toConnectedUserDto(userId: string): ConnectedUserDto {
    return new ConnectedUserDto({ id: userId });
  }

  static toConnectedUsersDto(userIds: string[]): ConnectedUsersDto {
    return new ConnectedUsersDto({ ids: userIds });
  }

  static toDisconnectedUser(userId: string): DisconnectedUserDto {
    return new DisconnectedUserDto({ id: userId });
  }

  static toUserTyping(
    isTyping: boolean,
    chatId: string,
    userId: string,
  ): UserTypingDto {
    return new UserTypingDto({
      chat_id: chatId,
      is_typing: isTyping,
      user_id: userId,
    });
  }
}
