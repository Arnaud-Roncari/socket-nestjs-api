export class CreatedMessageDto {
  constructor(parameters: CreatedMessageDto) {
    Object.assign(this, parameters);
  }

  chat_id: string;
  user_id: string;
  text: string;
  created_at: Date;
}
