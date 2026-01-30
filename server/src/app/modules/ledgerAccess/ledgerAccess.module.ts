import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccess, LedgerAccessSchema } from './ledgerAccess.model';
import { LedgerAccessProvider } from './ledgerAccess.provider';
import { LedgerAccessService } from './ledgerAccess.service';

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
