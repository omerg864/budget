import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { SupportedIcons } from '@shared/constants/ledger.constants';
import { TransactionType } from '@shared/constants/transaction.constants';
import { HydratedDocument } from 'mongoose';
import {
  LedgerCategory,
  LedgerEntity,
} from '../../../../../shared/types/ledger.type';

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: true,
})
class Category implements Omit<LedgerCategory, 'id'> {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  color: string;

  @Prop({
    type: String,
    enum: Object.values(TransactionType),
    required: true,
  })
  type: TransactionType;

  @Prop({ type: String, required: false })
  imageId?: string;

  @Prop({ type: String, required: false })
  icon?: string;
}

const CategorySchema = SchemaFactory.createForClass(Category);

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Ledger implements Omit<LedgerEntity, 'id'> {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [CategorySchema], default: [] })
  categories: LedgerCategory[];

  @Prop({ type: String, required: true })
  icon: SupportedIcons;

  @Prop({ type: String, required: true })
  color: string;

  @Prop({ type: String, required: true })
  currency: SupportedCurrencies;
}

export type LedgerDocument = HydratedDocument<Ledger>;
export const LedgerSchema = SchemaFactory.createForClass(Ledger);
