import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthResponse, User } from '../entities/users.entity';
import { Inject } from '@nestjs/common';
import { AUTH_SERVICE } from '../../../ems-common/src/common/constant';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserInput } from '../dto/users.dto';
import { sendRequest } from '../../../ems-common/src/common/utils';

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

  @Query(() => User)
  async getProfile(@Context('req') req: any): Promise<any> {
    const user = req.user;
    return await sendRequest(
      'findOne',
      user.sub,
      null,
      'auth',
      this.authClient,
    );
  }
}
