export class MessageEntity {
  id: string;
  userId: string;
  text: string;
  hasBeenRead: boolean;
  createdAt: Date;

  constructor(parameters: MessageEntity) {
    Object.assign(this, parameters);
  }

  static fromJson(json: any): MessageEntity | null {
    if (!json) {
      return null;
    }

    const message = new MessageEntity({
      id: json._id.toString(),
      userId: json.user_id.toString(),
      text: json.text,
      hasBeenRead: json.has_been_read,
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
