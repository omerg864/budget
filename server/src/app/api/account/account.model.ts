import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccountType } from '../../../../../shared/constants/account.constants.js';
import { SupportedCurrencies } from '../../../../../shared/constants/currency.constants.js';
import { AccountEntity } from '../../../../../shared/types/account.type.js';
import { Ledger } from '../ledger/ledger.model.js';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Account implements Omit<AccountEntity, 'id'> {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: AccountType })
  type: AccountType;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: '#000000' })
  color: string;

  @Prop({ type: Types.ObjectId, ref: Ledger.name, required: true })
  ledgerId: string;

  @Prop({ required: true, enum: SupportedCurrencies })
  currency: SupportedCurrencies;

  @Prop({ type: Types.ObjectId, ref: 'user', required: false })
  ownerId?: string;

  @Prop()
  notes?: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: false, default: null })
  deletedAt?: Date;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);

// index
AccountSchema.index({ ledgerId: 1 });
