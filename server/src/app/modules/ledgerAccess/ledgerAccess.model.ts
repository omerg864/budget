import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LEDGER_ACCESS } from '../../../constants/ledgerAccess.constants';
import { LedgerAccessEntity } from '../../../types/ledgerAccess.type';
import { Ledger } from '../../api/ledger/ledger.model';

@Schema({ timestamps: true })
export class LedgerAccess implements LedgerAccessEntity {
  @Prop({ type: Types.ObjectId, ref: Ledger.name, required: true })
  ledgerId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, enum: LEDGER_ACCESS })
  role: LEDGER_ACCESS;
}

export type LedgerAccessDocument = HydratedDocument<LedgerAccess>;
export const LedgerAccessSchema = SchemaFactory.createForClass(LedgerAccess);

// index
LedgerAccessSchema.index({ ledgerId: 1, userId: 1 }, { unique: true });
LedgerAccessSchema.index({ userId: 1 });
