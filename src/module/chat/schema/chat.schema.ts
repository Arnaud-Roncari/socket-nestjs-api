import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/module/user/user.schema';
import { Message } from 'src/module/chat/schema/message.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  })
  user_ids: [mongoose.Types.ObjectId | User];

  @Prop({ type: [Message], default: [] })
  messages: Message[];
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
