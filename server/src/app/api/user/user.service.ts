import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../../../shared/types/user.type';
import { UserProvider } from './user.provider';
import { LedgerAccessRole } from '@shared/constants/ledger.constants.js';
import { LedgerUser } from '@shared/types/ledger.type.js';

@Injectable()
export class UserService {
  constructor(private readonly userProvider: UserProvider) {}

  async findOne(id: string): Promise<UserEntity | null> {
    return this.userProvider.findById(id);
  }

  async findAll(ids?: string[]): Promise<UserEntity[]> {
    return this.userProvider.list(ids);
  }

  resolveUser(user: UserEntity, role: LedgerAccessRole): LedgerUser {
    return {
      name: user.name,
      email: user.email,
      id: user.id,
      role,
    };
  }
}
