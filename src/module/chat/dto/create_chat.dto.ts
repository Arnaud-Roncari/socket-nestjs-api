import { IsString } from 'class-validator';

export class CreateChatDto {
  constructor(parameters: CreateChatDto) {
    Object.assign(this, parameters);
  }

  @IsString()
  user_id: string;
}
