import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../../../shared/types/user.type.js';
import { UserProvider } from './user.provider.js';

@Injectable()
export class UserService {
  constructor(private readonly userProvider: UserProvider) {}

  async findOne(id: string): Promise<UserEntity | null> {
    return this.userProvider.findById(id);
  }
}
