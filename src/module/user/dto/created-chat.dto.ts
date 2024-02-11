import { UserDto } from 'src/module/user/dto/user.dto';
import { MessageDto } from './message.dto';

export class CreatedChatDto {
  constructor(parameters: CreatedChatDto) {
    Object.assign(this, parameters);
  }

  chat_id: string;
  request_uuid: string;
  users: UserDto[];
  messages: MessageDto[];
}
