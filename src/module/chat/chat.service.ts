import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schema/chat.schema';
import { ChatEntity } from './entity/chat.entity';
import { CreateMessageDto } from '../user/dto/create-message.dto';
import { MessageEntity } from './entity/message.entity';
import { ChatNotFoundException } from 'src/common/errors/ws/chat-not-found';
import { ChatAlreadyExist } from 'src/common/errors/ws/chat-already-exist';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: mongoose.Model<Chat>,
  ) {}

  async getChats(userId: string): Promise<ChatEntity[]> {
    const chats = await this.chatModel
      .find({ user_ids: userId })
      .populate('user_ids');
    return ChatEntity.fromJsons(chats);
  }

  async createChat(userIds: String[], request_uuid: string) {
    const existingChat = await this.chatModel.findOne({ user_ids: userIds });
    if (existingChat) {
      throw new ChatAlreadyExist(request_uuid);
    }

    let chat = await this.chatModel.create({
      user_ids: userIds,
    });
    chat = await chat.populate('user_ids');
    return ChatEntity.fromJson(chat);
  }

  async createMessage(
    dto: CreateMessageDto,
    userId: string,
    request_uuid: string,
  ): Promise<MessageEntity> {
    const chat = await this.chatModel.findOne({
      _id: dto.chat_id,
      user_ids: userId,
    });
    if (!chat) {
      throw new ChatNotFoundException(request_uuid);
    }
    const updatedChat = await this.chatModel.findByIdAndUpdate(
      dto.chat_id,
      {
        $push: {
          messages: { user_id: userId, text: dto.text, created_at: new Date() },
        },
      },
      { new: true },
    );
    return MessageEntity.fromJson(
      updatedChat.messages[updatedChat.messages.length - 1],
    );
  }
}
