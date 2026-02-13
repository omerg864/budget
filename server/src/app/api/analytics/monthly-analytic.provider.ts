import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MonthlyAnalyticEntity } from '@shared/types/analytic.type';
import { Model } from 'mongoose';
import {
  MonthlyAnalytic,
  MonthlyAnalyticDocument,
} from './monthly-analytic.model';

@Injectable()
export class MonthlyAnalyticProvider {
  constructor(
    @InjectModel(MonthlyAnalytic.name)
    private readonly monthlyAnalyticModel: Model<MonthlyAnalyticDocument>,
  ) {}

  async create(monthlyAnalytic: MonthlyAnalyticEntity) {
    return this.monthlyAnalyticModel.create(monthlyAnalytic);
  }

  async update(ledgerId: string, month: Date, data: MonthlyAnalyticEntity) {
    return this.monthlyAnalyticModel.findOneAndUpdate(
      { ledgerId, month },
      data,
      {
        new: true,
        upsert: true,
      },
    );
  }

  async findByLedgerIdAndMonth(ledgerId: string, month: Date) {
    return this.monthlyAnalyticModel.findOne({ ledgerId, month });
  }

  async findByLedgerIdAndDateRange(ledgerId: string, start: Date, end: Date) {
    return this.monthlyAnalyticModel.find({
      ledgerId,
      month: { $gte: start, $lte: end },
    });
  }
}
