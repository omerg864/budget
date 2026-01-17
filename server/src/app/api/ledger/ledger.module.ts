import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerController } from './ledger.controller.js';
import { LedgerService } from './ledger.service.js';
import { LedgerProvider } from './ledger.provider.js';
import { Ledger, LedgerSchema } from './ledger.model.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ledger.name, schema: LedgerSchema }]),
  ],
  controllers: [LedgerController],
  providers: [LedgerService, LedgerProvider],
  exports: [LedgerService],
})
export class LedgerModule {}
