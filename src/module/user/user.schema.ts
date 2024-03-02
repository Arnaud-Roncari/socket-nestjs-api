import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password_hash: string;

  @Prop()
  fcm_token: string | null;

  @Prop()
  avatar_number: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
