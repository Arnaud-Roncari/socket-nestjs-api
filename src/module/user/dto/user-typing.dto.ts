export class UserTypingDto {
  constructor(parameters: UserTypingDto) {
    Object.assign(this, parameters);
  }

  chat_id: string;
  is_typing: boolean;
  user_id: string;
}
