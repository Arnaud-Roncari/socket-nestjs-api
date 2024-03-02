export class MessageDto {
  constructor(parameters: MessageDto) {
    Object.assign(this, parameters);
  }

  id: string;
  user_id: string;
  text: string;
  has_been_read: boolean;
  created_at: Date;
}
