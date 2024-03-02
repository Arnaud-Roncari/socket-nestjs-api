import { Injectable } from '@nestjs/common';
import { Message, getMessaging } from 'firebase-admin/messaging';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { ChatDto } from '../user/dto/chat.dto';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class NotificationService {
  constructor() {
    initializeApp({
      credential: applicationDefault(),
    });
  }

  /// The payload is too big. It will crash after few messages.
  async sendNotification(
    message: string,
    chat: ChatDto,
    fcmToken: string,
    sender: UserDto,
    recipient: UserDto,
  ) {
    const notification = {
      notification: {
        title: sender.username,
        body: message,
      },
      data: {
        chat: JSON.stringify(chat),
        sender: JSON.stringify(sender),
        recipient: JSON.stringify(recipient),
      },
      token: fcmToken,
    };
    try {
      const messaging = getMessaging();
      const res = await messaging.send(notification);
    } catch (e) {
      console.log(e);
    }
  }
}
