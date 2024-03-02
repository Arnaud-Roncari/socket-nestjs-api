import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Chat, ChatSchema } from '../chat/schema/chat.schema';
import { UserGateway } from './user.gateway';
import { ChatService } from '../chat/chat.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  providers: [UserService, UserGateway, ChatService, NotificationService],
  controllers: [UserController],
})
export class UserModule {}
