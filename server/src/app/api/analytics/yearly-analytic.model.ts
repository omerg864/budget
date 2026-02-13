import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { AccountEntity } from '@shared/types/account.type';
import { YearlyAnalyticEntity } from '@shared/types/analytic.type';
import { CreditEntity } from '@shared/types/credit.type';
import { LedgerCategory, LedgerUser } from '@shared/types/ledger.type';
import { HydratedDocument, Types } from 'mongoose';
import {
  CategorySchema,
  Ledger,
  LedgerUserSchema,
} from '../ledger/ledger.model';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class YearlyAnalytic implements YearlyAnalyticEntity {
  id: string;

  @Prop({ type: Types.ObjectId, ref: Ledger.name, required: true })
  ledgerId: string;

  @Prop({ required: true })
  year: number;

  @Prop({ type: String, required: true })
  currency: SupportedCurrencies;

  @Prop({ required: true, default: 0 })
  totalAssets: number;

  @Prop({ required: true, default: 0 })
  totalIncome: number;

  @Prop({ required: true, default: 0 })
  totalExpense: number;

  @Prop({ required: true, default: 0 })
  totalBalance: number;

  @Prop({ type: [CategorySchema], default: [] })
  categories: LedgerCategory[];

  @Prop({ type: [LedgerUserSchema], default: [] })
  users: LedgerUser[];

  @Prop({ type: Object, default: {} })
  totalIncomeByUser: Record<string, number>;

  @Prop({ type: Object, default: {} })
  totalExpenseByUser: Record<string, number>;

  @Prop({ type: Types.Map, of: Number, default: {} })
  totalIncomeByCategory: Record<string, number>;

  @Prop({ type: Types.Map, of: Number, default: {} })
  totalExpenseByCategory: Record<string, number>;

  @Prop({ type: Object, default: {} })
  totalByAccount: Record<AccountEntity['id'], number>;

  @Prop({ type: Object, default: {} })
  totalByCredit: Record<CreditEntity['id'], number>;

  createdAt: Date;
  updatedAt: Date;
}

export type YearlyAnalyticDocument = HydratedDocument<YearlyAnalytic>;
export const YearlyAnalyticSchema =
  SchemaFactory.createForClass(YearlyAnalytic);

// index
YearlyAnalyticSchema.index({ ledgerId: 1, year: 1 }, { unique: true });
