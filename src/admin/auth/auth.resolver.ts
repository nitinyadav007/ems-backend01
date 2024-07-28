import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthResponse, User } from '../entities/users.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { AUTH_SERVICE } from '../../../ems-common/src/common/constant';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserInput } from '../dto/users.dto';
import { IJwtPayload, sendRequest } from '../../../ems-common/src/common/utils';
import { ObjectId } from 'mongodb';
import { AuthGuard } from './auth.interceptor';
import { CurrentUser } from '../../common/currrentuser';

@Resolver('Auth')
export class AuthResolver {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Mutation(() => AuthResponse)
  async loginUser(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<AuthResponse> {
    return await sendRequest<AuthResponse, LoginUserInput>(
      'login',
      loginUserInput,
      null,
      'auth',
      this.authClient,
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async getProfile(@CurrentUser() user: IJwtPayload): Promise<User> {
    return await sendRequest<User, ObjectId>(
      'findOne',
      user.sub,
      null,
      'auth',
      this.authClient,
    );
  }

  @Mutation(() => AuthResponse)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return await sendRequest<AuthResponse, string>(
      'refreshToken',
      refreshToken,
      null,
      'auth',
      this.authClient,
    );
  }
}
