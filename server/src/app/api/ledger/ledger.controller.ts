import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants.js';
import { CreateLedgerDto } from './ledger.dto.js';
import { Ledger } from './ledger.model.js';
import { LedgerService } from './ledger.service.js';

import { generateLink } from '../../../../../shared/utils/route.utils.js';

@Controller(generateLink({ route: [API_ROUTES.LEDGER.BASE] }))
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post(API_ROUTES.LEDGER.CREATE)
  create(@Body() createLedgerDto: CreateLedgerDto): Promise<Ledger> {
    return this.ledgerService.create(createLedgerDto);
  }

  @Get(API_ROUTES.LEDGER.FIND_ALL)
  findAll(): Promise<Ledger[]> {
    return this.ledgerService.findAll();
  }

  @Get(API_ROUTES.LEDGER.FIND_ONE)
  findOne(@Param('id') ledgerId: string): Promise<Ledger | null> {
    return this.ledgerService.findOne(ledgerId);
  }

  @Patch(API_ROUTES.LEDGER.UPDATE)
  update(
    @Param('id') ledgerId: string,
    @Body() updateData: Partial<CreateLedgerDto>,
  ): Promise<Ledger | null> {
    return this.ledgerService.update(ledgerId, updateData);
  }

  @Delete(API_ROUTES.LEDGER.DELETE)
  remove(@Param('id') ledgerId: string): Promise<Ledger | null> {
    return this.ledgerService.remove(ledgerId);
  }
}
