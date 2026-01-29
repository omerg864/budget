import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CreditType } from '../../../../../shared/constants/credit.constants.js';
import { CreditEntity } from '../../../../../shared/types/credit.type.js';
import { Account } from '../account/account.model.js';
import { Ledger } from '../ledger/ledger.model.js';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Credit implements CreditEntity {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  accountId: string;

  @Prop({ type: Types.ObjectId, ref: Ledger.name, required: true })
  ledgerId: string;

  @Prop({ type: Types.ObjectId, ref: 'user', required: false })
  ownerId?: string;

  @Prop({ required: true, enum: CreditType })
  type: CreditType;

  @Prop({ required: true })
  color: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: false, default: null })
  deletedAt?: Date;
}

export type CreditDocument = HydratedDocument<Credit>;
export const CreditSchema = SchemaFactory.createForClass(Credit);

// index
CreditSchema.index({ ledgerId: 1 });
CreditSchema.index({ accountId: 1 });
