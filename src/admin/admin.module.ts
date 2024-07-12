import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UsersResolver } from './users/users.resolver';
import { TCPProvider } from '../../ems-common/src/common/utils';
import {
  AUTH_SERVICE,
  USERS_SERVICE,
} from '../../ems-common/src/common/constant';
import { AuthResolver } from './auth/auth.resolver';

@Module({
  imports: [],
  providers: [
    AuthResolver,
    UsersResolver,
    UsersService,
    TCPProvider(USERS_SERVICE),
    TCPProvider(AUTH_SERVICE),
  ],
})
export class AdminModule {}
