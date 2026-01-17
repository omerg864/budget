import { LEDGER_ACCESS } from '../constants/ledgerAccess.constants.js';

export type LedgerAccessEntity = {
  ledgerId: string;
  userId: string;
  role: LEDGER_ACCESS;
};
