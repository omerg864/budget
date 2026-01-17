import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from '../../../../../shared/types/user.type.js';
import { User, UserDocument } from './user.model.js';

@Injectable()
export class UserProvider {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(userId: string): Promise<UserEntity | null> {
    return this.userModel.findById(userId);
  }
}
