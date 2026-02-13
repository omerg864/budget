import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { YearlyAnalyticEntity } from '@shared/types/analytic.type';
import { Model } from 'mongoose';
import {
  YearlyAnalytic,
  YearlyAnalyticDocument,
} from './yearly-analytic.model';

@Injectable()
export class YearlyAnalyticProvider {
  constructor(
    @InjectModel(YearlyAnalytic.name)
    private readonly yearlyAnalyticModel: Model<YearlyAnalyticDocument>,
  ) {}

  async create(yearlyAnalytic: YearlyAnalyticEntity) {
    return this.yearlyAnalyticModel.create(yearlyAnalytic);
  }

  async update(ledgerId: string, year: number, data: YearlyAnalyticEntity) {
    return this.yearlyAnalyticModel.findOneAndUpdate({ ledgerId, year }, data, {
      new: true,
      upsert: true,
    });
  }

  async findByLedgerIdAndYear(ledgerId: string, year: number) {
    return this.yearlyAnalyticModel.findOne({ ledgerId, year });
  }

  async findByLedgerIdAndDateRange(
    ledgerId: string,
    start: number,
    end: number,
  ) {
    return this.yearlyAnalyticModel.find({
      ledgerId,
      year: { $gte: start, $lte: end },
    });
  }
}
