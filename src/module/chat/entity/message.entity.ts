export class MessageEntity {
  userId: string;
  text: string;
  createdAt: Date;

  constructor(parameters: MessageEntity) {
    Object.assign(this, parameters);
  }

  static fromJson(json: any): MessageEntity | null {
    if (!json) {
      return null;
    }

    const message = new MessageEntity({
      userId: json.user_id.toString(),
      text: json.text,
      createdAt: json.created_at,
    });

    return message;
  }

  static fromJsons(jsons: any[]): MessageEntity[] {
    if (!jsons) {
      return [];
    }

    const messages: MessageEntity[] = [];
    for (const json of jsons) {
      const message = MessageEntity.fromJson(json);
      if (message) {
        messages.push(message);
      }
    }
    return messages;
  }
}
