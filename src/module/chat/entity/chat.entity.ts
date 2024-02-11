import { UserEntity } from 'src/module/user/user.entity';
import { MessageEntity } from './message.entity';

export class ChatEntity {
  id: string;
  users: UserEntity[];
  messages: MessageEntity[];

  constructor(parameters: ChatEntity) {
    Object.assign(this, parameters);
  }

  static fromJson(json: any): ChatEntity | null {
    if (!json) {
      return null;
    }

    const chat = new ChatEntity({
      id: json._id.toString(),
      users: UserEntity.fromJsons(json.user_ids),
      messages: MessageEntity.fromJsons(json.messages),
    });

    return chat;
  }

  static fromJsons(jsons: any[]): ChatEntity[] {
    if (!jsons) {
      return [];
    }

    const chats: ChatEntity[] = [];
    for (const json of jsons) {
      const chat = ChatEntity.fromJson(json);
      if (chat) {
        chats.push(chat);
      }
    }
    return chats;
  }
}
