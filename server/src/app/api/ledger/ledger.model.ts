import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SupportedIcons } from '@shared/constants/ledger.constants';
import { TransactionType } from '@shared/constants/transaction.constants';
import { HydratedDocument } from 'mongoose';
import {
  LedgerCategory,
  LedgerEntity,
} from '../../../../../shared/types/ledger.type';
import { SupportedCurrencies } from '@shared/constants/currency.constants';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Ledger implements Omit<LedgerEntity, 'id'> {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        color: { type: String, required: true },
        type: {
          type: String,
          enum: Object.values(TransactionType),
          required: true,
        },
        imageId: { type: String, required: false },
        icon: { type: String, required: false },
      },
    ],
    default: [],
  })
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
