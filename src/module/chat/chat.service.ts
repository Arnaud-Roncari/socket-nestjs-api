import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schema/chat.schema';
import { ChatEntity } from './entity/chat.entity';
import { CreateMessageDto } from '../user/dto/create-message.dto';
import { MessageEntity } from './entity/message.entity';
import { ChatNotFoundException } from 'src/common/errors/ws/chat-not-found';
import { ChatAlreadyExist } from 'src/common/errors/ws/chat-already-exist';
import { ReadMessagesDto } from '../user/dto/read_messages';
import { Message } from 'firebase-admin/messaging';
import { MessageDocument } from './schema/message.schema';

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

  async getOneChat(chatId: string): Promise<ChatEntity> {
    const chat = await this.chatModel.findById(chatId).populate('user_ids');
    return ChatEntity.fromJson(chat);
  }

  async readMessages(dto: ReadMessagesDto): Promise<void> {
    let chat = await this.chatModel.findById(dto.chat_id);

    for (let message of chat.messages) {
      for (let readMessageId of dto.message_ids) {
        let id = (message as MessageDocument)._id
        if (id.toString() === readMessageId) {
          message.has_been_read = true;
        }
      }
    }
    await chat.save();
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
          messages: { user_id: new mongoose.Types.ObjectId(userId), text: dto.text, created_at: new Date() },
        },
      },
      { new: true },
    );

    return MessageEntity.fromJson(
      updatedChat.messages[updatedChat.messages.length - 1],
    );
  }
}
