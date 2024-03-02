import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {

  @Prop({ type: mongoose.Types.ObjectId })
  user_id: mongoose.Types.ObjectId;
 
  @Prop({ type: String })
  text: string;

  @Prop({ type: Boolean, default: false })
  has_been_read: Boolean;

  /// Bug: WIll attribute the same date. The one which is when the server started.
  @Prop({ type: Date, default: new Date() })
  created_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
