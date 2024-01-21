import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schema/chat.schema';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
