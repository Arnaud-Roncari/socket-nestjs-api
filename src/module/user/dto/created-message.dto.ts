export class CreatedMessageDto {
  constructor(parameters: CreatedMessageDto) {
    Object.assign(this, parameters);
  }

  id: string;
  chat_id: string;
  user_id: string;
  text: string;
  has_been_read: boolean;
  created_at: Date;
}
