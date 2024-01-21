import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { UserEntity } from './user.entity';
import { Chat } from '../chat/schema/chat.schema';
import { ChatEntity } from '../chat/entity/chat.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    @InjectModel(Chat.name) private chatModel: mongoose.Model<Chat>,
  ) {}

  async getUser(userId: string): Promise<UserEntity> {
    const user = await this.userModel.findById(userId);
    return UserEntity.fromJson(user);
  }

  async getAllUsers(userId: string): Promise<UserEntity[]> {
    /// Get all user chats.
    const chatModels = await this.chatModel
      .find({ user_ids: userId })
      .populate('user_ids');
    /// Create a Set of user ids from chats.
    const idsToExclude = new Set();
    for (let schema of chatModels) {
      let chat = ChatEntity.fromJson(schema);
      chat.users.map((user) => idsToExclude.add(user.id));
    }

    const users = await this.userModel.find({
      _id: { $nin: [...idsToExclude] },
    });
    return UserEntity.fromJsons(users);
  }
}
