import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PaginatedUser, User } from '../entities/users.entity';
import { ObjectId } from 'mongodb';
import {
  CreateUserInput,
  UpdateUserNameInput,
  UpdateUserPasswordInput,
  UpdateUserPersonalInput,
} from '../dto/users.dto';
import {
  BaseStatus,
  DeleteFilter,
  Ids,
  UpdateBaseStatusInput,
} from '../dto/common.dto';
import { ObjectIdScalar } from '../../common/objectId.sclar';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IJwtPayload, sendRequest } from '../../../ems-common/src/common/utils';
import { PUB_SUB } from '../../../ems-common/src/common/pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { USERS_SERVICE } from '../../../ems-common/src/common/constant';
import { CurrentUser } from '../../common/currrentuser';
import { GraphQLJSON } from 'graphql-scalars';
import { AuthGuard } from '../auth/auth.interceptor';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  // @UseGuards(AuthGuard)
  @Mutation(() => User)
  async createUsers(
    @Args('createUsersInput') createUsersInput: CreateUserInput,
    // @CurrentUser() user: IJwtPayload,
  ) {
    return await sendRequest<User, CreateUserInput>(
      'create',
      createUsersInput,
      null,
      'users',
      this.userClient,
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedUser, { name: 'users' })
  async findAll(
    @CurrentUser() user: IJwtPayload,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 10 }) perPage: number,
    @Args('username', { type: () => String, nullable: true }) username: string,
    @Args('delete', { type: () => DeleteFilter, nullable: true })
    deleteFilter: DeleteFilter,
    @Args('ids', { type: () => [ObjectIdScalar], nullable: true })
    ids: [ObjectId],
    @Args('status', { type: () => BaseStatus, nullable: true })
    status: BaseStatus,
    @Args('projection', { type: () => GraphQLJSON, nullable: true })
    projection: Record<string, any>,
    @Args('sortBy', { type: () => GraphQLJSON, nullable: true })
    sortBy: Record<string, any>,
  ): Promise<PaginatedUser> {
    const result = await sendRequest<PaginatedUser, any>(
      'findAll',
      {
        page,
        perPage,
        ids,
        deleteFilter,
        username,
        projection,
        sortBy,
        status,
      },
      user,
      'users',
      this.userClient,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: IJwtPayload,
  ) {
    return await sendRequest<User, string>(
      'findOne',
      id,
      user,
      'users',
      this.userClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUserPersonal(
    @Args('updateUserPersonal')
    updateUserPersonalInput: UpdateUserPersonalInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    return await sendRequest<User, UpdateUserPersonalInput>(
      'update',
      updateUserPersonalInput,
      user,
      'users',
      this.userClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async updateUserPassword(
    @Args('updateUserPassword')
    updateUserPasswordInput: UpdateUserPasswordInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    return sendRequest<boolean, UpdateUserPasswordInput>(
      'updatePassword',
      updateUserPasswordInput,
      user,
      'users',
      this.userClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUserName(
    @CurrentUser() user: IJwtPayload,
    @Args('updateUserName')
    updateUserNameInput: UpdateUserNameInput,
  ) {
    return sendRequest<User, UpdateUserNameInput>(
      'updateUsername',
      updateUserNameInput,
      user,
      'users',
      this.userClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateStatus(
    @CurrentUser() user: IJwtPayload,
    @Args('updateUserStatus')
    updateUserStatus: UpdateBaseStatusInput,
  ) {
    return await sendRequest<User, UpdateBaseStatusInput>(
      'updateStatus',
      updateUserStatus,
      user,
      'users',
      this.userClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async removeUsers(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    return sendRequest<number, ObjectId[]>(
      'remove',
      ids,
      user,
      'users',
      this.userClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async restoreUsers(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    return sendRequest<number, ObjectId[]>(
      'restore',
      ids,
      user,
      'users',
      this.userClient,
    );
  }

  @Subscription(() => User, {
    name: 'userCreated',
  })
  userCreated() {
    return this.pubSub.asyncIterator('userCreated');
  }

  @Subscription(() => User, {
    name: 'userStatusUpdated',
  })
  userStatusUpdated() {
    return this.pubSub.asyncIterator('userStatusUpdated');
  }

  @Subscription(() => Ids, {
    name: 'userDeleted',
    resolve: (payload) => payload.userDeleted.ids,
  })
  userDeleted() {
    return this.pubSub.asyncIterator('userDeleted');
  }

  @Subscription(() => Ids, {
    name: 'userRestore',
  })
  userRestore() {
    return this.pubSub.asyncIterator('userRestore');
  }

  @Subscription(() => Boolean, {
    name: 'userPasswordUpdated',
  })
  userPasswordUpdated() {
    return this.pubSub.asyncIterator('userPasswordUpdated');
  }

  @Subscription(() => User, {
    name: 'userNameUpdated',
  })
  userNameUpdated() {
    return this.pubSub.asyncIterator('userNameUpdated');
  }

  @Subscription(() => User, {
    name: 'userPersonalUpdated',
  })
  userPersonalUpdated() {
    return this.pubSub.asyncIterator('userPersonalUpdated');
  }
}
