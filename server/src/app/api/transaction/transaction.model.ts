import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TransactionType } from '../../../../../shared/constants/transaction.constants.js';
import { TransactionEntity } from '../../../../../shared/types/transaction.type.js';
import { Credit } from '../credit/credit.model.js';
import { Ledger } from '../ledger/ledger.model.js';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Transaction implements TransactionEntity {
  id: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: Credit.name, required: true })
  creditId: string;

  @Prop({ type: Types.ObjectId, ref: Ledger.name, required: true })
  ledgerId: string;

  @Prop({ type: Types.ObjectId, ref: 'user', required: false })
  userId?: string;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true })
  date: Date;

  @Prop()
  category?: string;

  @Prop()
  notes?: string;

  @Prop()
  receiptImageId?: string;

  @Prop({ type: Types.ObjectId, ref: 'recurringTransaction', required: false })
  recurringTransactionId?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type TransactionDocument = HydratedDocument<Transaction>;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// index
TransactionSchema.index({ ledgerId: 1, date: 1 });
TransactionSchema.index({ creditId: 1, date: 1 });
TransactionSchema.index({ userId: 1, date: 1 });
TransactionSchema.index({ recurringTransactionId: 1 });
