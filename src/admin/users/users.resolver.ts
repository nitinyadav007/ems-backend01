import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { PaginatedUser, User } from '../entities/users.entity';
import { ObjectId } from 'mongodb';
import {
  CreateUserInput,
  UpdateUserNameInput,
  UpdateUserPasswordInput,
  UpdateUserPersonalInput,
} from '../dto/users.dto';
import { BaseStatus } from '../dto/common.dto';
import { ObjectIdScalar } from '../../common/objectId.sclar';
import { Inject, UseGuards } from '@nestjs/common';
import { USERS_SERVICE } from '../../../ems-common/src/common/constant';
import { ClientProxy } from '@nestjs/microservices';
import { sendRequest } from '../../../ems-common/src/common/utils';
import { PUB_SUB } from '../../../ems-common/src/common/pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AuthGuard } from '../auth/auth.interceptor';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async createUsers(
    @Args('createUsersInput') createUsersInput: CreateUserInput,
    @Context('req') req: any,
  ) {
    const newUser = await sendRequest<User, CreateUserInput>(
      'create',
      createUsersInput,
      {
        sub: '668d510e44f92225c514e983',
        // @ts-ignore
        type: 'admin',
      },
      'users',
      this.userClient,
    );
    await this.pubSub.publish('userUpdated', {
      userUpdated: newUser,
    });
    return newUser;
  }

  @Query(() => PaginatedUser, { name: 'Users' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 10 }) pagePage: number,
    @Args('username', { type: () => String, nullable: true }) username: string,
    @Args('ids', { type: () => [ObjectIdScalar], nullable: true })
    ids: [ObjectId],
    @Args('status', { type: () => BaseStatus, nullable: true })
    status: BaseStatus,
  ): Promise<any> {
    const result = sendRequest(
      'findAll',
      {
        page,
        pagePage,
        username,
        ids,
        status,
      },
      null,
      'users',
      this.userClient,
    );
    return result;
  }

  @Query(() => User, { name: 'User' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUserPersonal(
    @Args('updateUserPersonal')
    updateUserPersonalInput: UpdateUserPersonalInput,
  ) {
    return this.usersService.update(
      updateUserPersonalInput.id,
      updateUserPersonalInput,
    );
  }

  @Mutation(() => User)
  updateUserPassword(
    @Args('updateUserPassword')
    updateUserPasswordInput: UpdateUserPasswordInput,
  ) {
    return this.usersService.update(
      updateUserPasswordInput.id,
      updateUserPasswordInput,
    );
  }

  @Mutation(() => User)
  updateUserName(
    @Args('updateUserName')
    updateUserNameInput: UpdateUserNameInput,
  ) {
    return this.usersService.update(
      updateUserNameInput.id,
      updateUserNameInput,
    );
  }

  @Mutation(() => User)
  removeUsers(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  @Subscription(() => User, {
    name: 'userUpdated',
  })
  userUpdated() {
    return this.pubSub.asyncIterator('userUpdated');
  }
}
