import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schema/chat.schema';
import { ChatEntity } from './entity/chat.entity';

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

  async createChat(userIds: String[]) {
    let chat = await this.chatModel.create({
      user_ids: userIds,
    });
    chat = await chat.populate('user_ids');
    return ChatEntity.fromJson(chat);
  }
}
