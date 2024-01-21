import { UserDto } from '../user/dto/user.dto';
import { ChatDto } from './dto/chat.dto';
import { MessageDto } from './dto/message.dto';
import { ChatEntity } from './entity/chat.entity';

export class ChatMapper {
  static toChatDto(entity: ChatEntity): ChatDto {
    return new ChatDto({
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
}
