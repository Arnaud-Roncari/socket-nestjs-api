export class MessageDto {
  constructor(parameters: MessageDto) {
    Object.assign(this, parameters);
  }

  user_id: string;
  text: string;
  created_at: Date;
}
