import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccess, LedgerAccessSchema } from './ledgerAccess.model.js';
import { LedgerAccessProvider } from './ledgerAccess.provider.js';
import { LedgerAccessService } from './ledgerAccess.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LedgerAccess.name, schema: LedgerAccessSchema },
    ]),
  ],
  providers: [LedgerAccessProvider, LedgerAccessService],
  exports: [LedgerAccessService],
})
export class LedgerAccessModule {}
