import { IsBoolean, IsString } from 'class-validator';

export class TypingDto {
  constructor(parameters: TypingDto) {
    Object.assign(this, parameters);
  }

  @IsString()
  chat_id: string;

  @IsBoolean()
  is_typing: boolean;
}
