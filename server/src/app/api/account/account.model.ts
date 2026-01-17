import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccountType } from '../../../../../shared/constants/account.constants.js';
import { AccountEntity } from '../../../../../shared/types/account.type.js';
import { Ledger } from '../ledger/ledger.model.js';

@Schema({ timestamps: true })
export class Account implements Omit<AccountEntity, 'id'> {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: AccountType })
  type: AccountType;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ type: Types.ObjectId, ref: Ledger.name, required: true })
  ledgerId: string;

  @Prop()
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);

// index
AccountSchema.index({ ledgerId: 1 });
