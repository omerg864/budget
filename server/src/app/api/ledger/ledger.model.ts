import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TransactionType } from '../../../../../shared/constants/transaction.constants.js';
import {
  LedgerCategory,
  LedgerEntity,
} from '../../../../../shared/types/ledger.type.js';

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
}

export type LedgerDocument = HydratedDocument<Ledger>;
export const LedgerSchema = SchemaFactory.createForClass(Ledger);
