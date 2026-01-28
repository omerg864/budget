import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  TransactionRecurringFrequency,
  TransactionType,
} from '../../../../../shared/constants/transaction.constants.js';
import { RecurringTransactionEntity } from '../../../../../shared/types/recurringTransaction.type.js';
import { Credit } from '../credit/credit.model.js';
import { Ledger } from '../ledger/ledger.model.js';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class RecurringTransaction implements RecurringTransactionEntity {
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
  startDate: Date;

  @Prop()
  category?: string;

  @Prop()
  notes?: string;

  @Prop()
  receiptImageId?: string;

  @Prop()
  endDate?: Date;

  @Prop({ required: true, enum: TransactionRecurringFrequency })
  frequency: TransactionRecurringFrequency;

  createdAt: Date;
  updatedAt: Date;
}

export type RecurringTransactionDocument =
  HydratedDocument<RecurringTransaction>;
export const RecurringTransactionSchema =
  SchemaFactory.createForClass(RecurringTransaction);

// index
RecurringTransactionSchema.index({ ledgerId: 1 });
RecurringTransactionSchema.index({ creditId: 1 });
RecurringTransactionSchema.index({ userId: 1 });
