import { IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
  constructor(parameters: CreateChatDto) {
    Object.assign(this, parameters);
  }

  @IsString()
  user_id: string;

  @IsUUID()
  request_uuid: string;
}
