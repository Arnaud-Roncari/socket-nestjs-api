import { IsArray, IsString } from 'class-validator';

export class ReadMessagesDto {
  constructor(parameters: ReadMessagesDto) {
    Object.assign(this, parameters);
  }

  @IsString()
  chat_id: string;

  @IsArray()
  message_ids: string[];
}
