import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from '../../../../../shared/types/user.type';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserProvider {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(userId: string): Promise<UserEntity | null> {
    return this.userModel.findById(userId);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email });
  }

  async list(ids?: string[]): Promise<UserEntity[]> {
    const query: any = {};
    if (ids) {
      query._id = { $in: ids };
    }
    return this.userModel.find(query);
  }

  async update(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }
}
