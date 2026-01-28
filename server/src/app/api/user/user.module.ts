import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.model';
import { UserProvider } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    LedgerAccessModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProvider],
  exports: [UserService, UserProvider],
})
export class UserModule {}
