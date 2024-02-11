import { IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  constructor(parameters: CreateMessageDto) {
    Object.assign(this, parameters);
  }

  @IsString()
  chat_id: string;

  @IsString()
  text: string;

  @IsUUID()
  request_uuid: string;
}
