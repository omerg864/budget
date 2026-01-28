import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SupportedCurrencies } from '../../../../../shared/constants/currency.constants.js';
import { UserEntity } from '../../../../../shared/types/user.type.js';
import { Ledger } from '../ledger/ledger.model.js';

@Schema({
  timestamps: true,
  collection: 'user',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}) // Explicitly map to 'user' collection used by better-auth
export class User implements UserEntity {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  emailVerified: boolean;

  @Prop({ type: Types.ObjectId, ref: Ledger.name, required: true })
  defaultLedgerId: string;

  @Prop({
    required: true,
    enum: SupportedCurrencies,
    default: SupportedCurrencies.ILS,
  })
  defaultCurrency: SupportedCurrencies;

  @Prop()
  image?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
