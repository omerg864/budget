import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserEntity } from '../../../../../shared/types/user.type.js';

@Schema({ timestamps: true, collection: 'user' }) // Explicitly map to 'user' collection used by better-auth
export class User implements UserEntity {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  emailVerified: boolean;

  @Prop()
  image?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
