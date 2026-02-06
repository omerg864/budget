import { Injectable } from '@nestjs/common';
import { LedgerAccessRole } from '@shared/constants/ledger.constants.js';
import { LedgerUser } from '@shared/types/ledger.type.js';
import { UserEntity } from '../../../../../shared/types/user.type';
import { UserProvider } from './user.provider';

@Injectable()
export class UserService {
  constructor(private readonly userProvider: UserProvider) {}

  async findOne(id: string): Promise<UserEntity | null> {
    return this.userProvider.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userProvider.findByEmail(email);
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
