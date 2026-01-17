import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LedgerCategory,
  LedgerEntity,
} from '../../../../../shared/types/ledger.type.js';
import { TransactionType } from '../../../../../shared/constants/transaction.constants.js';

@Schema({ timestamps: true })
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
