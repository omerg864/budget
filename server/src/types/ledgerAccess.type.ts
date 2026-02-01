import { LedgerAccessRole } from '@shared/constants/ledger.constants';

export type LedgerAccessEntity = {
  ledgerId: string;
  userId: string;
  role: LedgerAccessRole;
};
