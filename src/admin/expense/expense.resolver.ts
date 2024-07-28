import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PUB_SUB } from '../../../ems-common/src/common/pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AuthGuard } from '../auth/auth.interceptor';
import {
  ExpenseAccount,
  ExpenseBudget,
  ExpenseCategory,
  ExpenseRecurring,
  ExpenseTransaction,
  PaginatedExpenseAccount,
  PaginatedExpenseBudget,
  PaginatedExpenseCategory,
  PaginatedExpenseRecurring,
  PaginatedExpenseTransaction,
} from '../entities/expense.entity';
import {
  CreateExpenseAccountInput,
  CreateExpenseBudgetInput,
  CreateExpenseCategoryInput,
  CreateExpenseRecurringInput,
  CreateExpenseTransactionInput,
  UpdateExpenseAccountInput,
  UpdateExpenseBudgetInput,
  UpdateExpenseCategoryInput,
  UpdateExpenseRecurringInput,
  UpdateExpenseTransactionInput,
  UpdateExpenseTransactionStatusInput,
} from '../dto/expense.dto';
import { CurrentUser } from '../../common/currrentuser';
import { IJwtPayload, sendRequest } from '../../../ems-common/src/common/utils';
import {
  BaseStatus,
  DeleteFilter,
  Ids,
  TransactionType,
  UpdateBaseStatusInput,
} from '../dto/common.dto';
import { ObjectIdScalar } from '../../common/objectId.sclar';
import { ObjectId } from 'mongodb';
import { GraphQLJSON } from 'graphql-scalars';

@Resolver()
export class ExpenseResolver {
  constructor(
    @Inject('EXPENSE_SERVICE') private readonly expenseClient: ClientProxy,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseAccount)
  async createAccount(
    @Args('createExpenseAccountInput')
    createExpenseAccountInput: CreateExpenseAccountInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<ExpenseAccount, CreateExpenseAccountInput>(
      'create',
      createExpenseAccountInput,
      user,
      'expenseAccount',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseAccountCreated', {
      ['expenseAccountCreated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseAccount)
  async updateAccount(
    @Args('updateExpenseAccountInput')
    updateExpenseAccountInput: UpdateExpenseAccountInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<ExpenseAccount, UpdateExpenseAccountInput>(
      'update',
      updateExpenseAccountInput,
      user,
      'expenseAccount',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseAccountUpdated', {
      ['expenseAccountUpdated']: result,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseAccount)
  async updateAccountStatus(
    @Args('updateExpenseAccountStatusInput')
    updateExpenseAccountStatusInput: UpdateBaseStatusInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<ExpenseAccount, UpdateBaseStatusInput>(
      'updateStatus',
      updateExpenseAccountStatusInput,
      user,
      'expenseAccount',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseAccountStatusUpdated', {
      ['expenseAccountStatusUpdated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedExpenseAccount, { name: 'expenseAccounts' })
  async findAllAccount(
    @CurrentUser() user: IJwtPayload,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 10 }) perPage: number,
    @Args('delete', { type: () => DeleteFilter, nullable: true })
    deleteFilter: DeleteFilter,
    @Args('ids', { type: () => [ObjectIdScalar], nullable: true })
    ids: [ObjectId],
    @Args('status', { type: () => BaseStatus, nullable: true })
    status: BaseStatus,
    @Args('type', { type: () => String, nullable: true })
    type: string,
    @Args('projection', { type: () => GraphQLJSON, nullable: true })
    projection: Record<string, any>,
    @Args('sortBy', { type: () => GraphQLJSON, nullable: true })
    sortBy: Record<string, any>,
  ): Promise<PaginatedExpenseAccount> {
    const result = await sendRequest<PaginatedExpenseAccount, any>(
      'findAll',
      {
        page,
        perPage,
        ids,
        deleteFilter,
        projection,
        sortBy,
        status,
        type,
      },
      user,
      'expenseAccount',
      this.expenseClient,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => ExpenseAccount, { name: 'expenseAccount' })
  async findOneAccount(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: IJwtPayload,
  ) {
    return await sendRequest<ExpenseAccount, string>(
      'findOne',
      id,
      user,
      'expenseAccount',
      this.expenseClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async removeAccounts(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'remove',
      ids,
      user,
      'expenseAccount',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseAccountsRemoved', {
      ['expenseAccountsRemoved']: ids,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async restoreAccounts(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'restore',
      ids,
      user,
      'expenseAccount',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseAccountsRestore', {
      ['expenseAccountsRestore']: ids,
    });
    return result;
  }

  @Subscription(() => ExpenseAccount, {
    name: 'expenseAccountCreated',
  })
  expenseAccountCreated() {
    return this.pubSub.asyncIterator('expenseAccountCreated');
  }

  @Subscription(() => ExpenseAccount, {
    name: 'expenseAccountUpdated',
  })
  expenseAccountUpdated() {
    return this.pubSub.asyncIterator('expenseAccountUpdated');
  }

  @Subscription(() => ExpenseAccount, {
    name: 'expenseAccountStatusUpdated',
  })
  expenseAccountStatusUpdated() {
    return this.pubSub.asyncIterator('expenseAccountStatusUpdated');
  }

  @Subscription(() => Ids, {
    name: 'expenseAccountsRemoved',
    resolve: (payload) => payload.expenseAccountsRemoved.ids,
  })
  expenseAccountsRemoved() {
    return this.pubSub.asyncIterator('expenseAccountsRemoved');
  }

  @Subscription(() => Ids, {
    name: 'expenseAccountsRestore',
    resolve: (payload) => payload.expenseAccountsRestore.ids,
  })
  expenseAccountsRestore() {
    return this.pubSub.asyncIterator('expenseAccountsRestore');
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseBudget)
  async createBudget(
    @Args('createExpenseBudgetInput')
    createExpenseBudgetInput: CreateExpenseBudgetInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<ExpenseBudget, CreateExpenseBudgetInput>(
      'create',
      createExpenseBudgetInput,
      user,
      'expenseBudget',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseBudgetCreated', {
      ['expenseBudgetCreated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseBudget)
  async updateBudget(
    @Args('updateExpenseBudgetInput')
    updateExpenseBudgetInput: UpdateExpenseBudgetInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<ExpenseBudget, UpdateExpenseBudgetInput>(
      'update',
      updateExpenseBudgetInput,
      user,
      'expenseBudget',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseBudgetUpdated', {
      ['expenseBudgetUpdated']: result,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseBudget)
  async updateBudgetStatus(
    @Args('updateExpenseBudgetStatusInput')
    updateExpenseBudgetStatusInput: UpdateBaseStatusInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<ExpenseBudget, UpdateBaseStatusInput>(
      'updateStatus',
      updateExpenseBudgetStatusInput,
      user,
      'expenseBudget',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseBudgetStatusUpdated', {
      ['expenseBudgetStatusUpdated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedExpenseBudget, { name: 'expenseBudgets' })
  async findAllBudget(
    @CurrentUser() user: IJwtPayload,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 10 }) perPage: number,
    @Args('delete', { type: () => DeleteFilter, nullable: true })
    deleteFilter: DeleteFilter,
    @Args('ids', { type: () => [ObjectIdScalar], nullable: true })
    ids: [ObjectId],
    @Args('projection', { type: () => GraphQLJSON, nullable: true })
    projection: Record<string, any>,
    @Args('sortBy', { type: () => GraphQLJSON, nullable: true })
    sortBy: Record<string, any>,
    @Args('status', { type: () => BaseStatus, nullable: true })
    status: BaseStatus,
    @Args('categoryId', { type: () => ObjectIdScalar, nullable: true })
    categoryId: ObjectId,
  ): Promise<PaginatedExpenseBudget> {
    const result = await sendRequest<PaginatedExpenseBudget, any>(
      'findAll',
      {
        page,
        perPage,
        ids,
        deleteFilter,
        projection,
        sortBy,
        status,
        categoryId,
      },
      user,
      'expenseBudget',
      this.expenseClient,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => ExpenseBudget, { name: 'expenseBudget' })
  async findOneBudget(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: IJwtPayload,
  ) {
    return await sendRequest<ExpenseBudget, string>(
      'findOne',
      id,
      user,
      'expenseBudget',
      this.expenseClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async removeExpenseBudget(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'remove',
      ids,
      user,
      'expenseBudget',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseBudgetsRemoved', {
      ['expenseBudgetsRemoved']: ids,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async restoreExpenseBudget(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'restore',
      ids,
      user,
      'expenseBudget',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseBudgetsRestore', {
      ['expenseBudgetsRestore']: ids,
    });
    return result;
  }

  @Subscription(() => ExpenseBudget, {
    name: 'expenseBudgetCreated',
  })
  expenseBudgetCreated() {
    return this.pubSub.asyncIterator('expenseBudgetCreated');
  }

  @Subscription(() => ExpenseBudget, {
    name: 'expenseBudgetUpdated',
  })
  expenseBudgetUpdated() {
    return this.pubSub.asyncIterator('expenseBudgetUpdated');
  }

  @Subscription(() => ExpenseBudget, {
    name: 'expenseBudgetStatusUpdated',
  })
  expenseBudgetStatusUpdated() {
    return this.pubSub.asyncIterator('expenseBudgetStatusUpdated');
  }

  @Subscription(() => Ids, {
    name: 'expenseBudgetsRemoved',
    resolve: (payload) => payload.expenseBudgetsRemoved.ids,
  })
  expenseBudgetsRemoved() {
    return this.pubSub.asyncIterator('expenseBudgetsRemoved');
  }

  @Subscription(() => Ids, {
    name: 'expenseBudgetsRestore',
    resolve: (payload) => payload.expenseBudgetsRestore.ids,
  })
  expenseBudgetsRestore() {
    return this.pubSub.asyncIterator('expenseBudgetsRestore');
  }

  /////////////////////////////Category//////////////////////
  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseCategory)
  async createCategory(
    @Args('createExpenseCategoryInput')
    createExpenseCategoryInput: CreateExpenseCategoryInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<
      ExpenseCategory,
      CreateExpenseCategoryInput
    >(
      'create',
      createExpenseCategoryInput,
      user,
      'expenseCategory',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseCategoryCreated', {
      ['expenseCategoryCreated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseCategory)
  async updateCategory(
    @Args('updateExpenseCategoryInput')
    updateExpenseCategoryInput: UpdateExpenseCategoryInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<
      ExpenseCategory,
      UpdateExpenseCategoryInput
    >(
      'update',
      updateExpenseCategoryInput,
      user,
      'expenseCategory',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseCategoryUpdated', {
      ['expenseCategoryUpdated']: result,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseCategory)
  async updateCategoryStatus(
    @Args('updateExpenseCategoryStatusInput')
    updateExpenseCategoryStatusInput: UpdateBaseStatusInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<ExpenseCategory, UpdateBaseStatusInput>(
      'updateStatus',
      updateExpenseCategoryStatusInput,
      user,
      'expenseCategory',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseCategoryStatusUpdated', {
      ['expenseCategoryStatusUpdated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedExpenseCategory, { name: 'expenseCategories' })
  async findAllCategory(
    @CurrentUser() user: IJwtPayload,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 10 }) perPage: number,
    @Args('delete', { type: () => DeleteFilter, nullable: true })
    deleteFilter: DeleteFilter,
    @Args('ids', { type: () => [ObjectIdScalar], nullable: true })
    ids: [ObjectId],
    @Args('projection', { type: () => GraphQLJSON, nullable: true })
    projection: Record<string, any>,
    @Args('sortBy', { type: () => GraphQLJSON, nullable: true })
    sortBy: Record<string, any>,
    @Args('status', { type: () => BaseStatus, nullable: true })
    status: BaseStatus,
    @Args('name', { type: () => String, nullable: true })
    name: string,
  ): Promise<PaginatedExpenseCategory> {
    const result = await sendRequest<PaginatedExpenseCategory, any>(
      'findAll',
      {
        page,
        perPage,
        ids,
        deleteFilter,
        projection,
        sortBy,
        status,
      },
      user,
      'expenseCategory',
      this.expenseClient,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => ExpenseCategory, { name: 'expenseCategory' })
  async findOneCategory(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: IJwtPayload,
  ) {
    return await sendRequest<ExpenseCategory, string>(
      'findOne',
      id,
      user,
      'expenseCategory',
      this.expenseClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async removeExpenseCategory(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'remove',
      ids,
      user,
      'expenseCategory',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseCategoriesRemoved', {
      ['expenseCategoriesRemoved']: ids,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async restoreExpenseCategory(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'restore',
      ids,
      user,
      'expenseCategory',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseCategoriesRestored', {
      ['expenseCategoriesRestored']: ids,
    });
    return result;
  }

  @Subscription(() => ExpenseCategory, {
    name: 'expenseCategoryCreated',
  })
  expenseCategoryCreated() {
    return this.pubSub.asyncIterator('expenseCategoryCreated');
  }

  @Subscription(() => ExpenseCategory, {
    name: 'expenseCategoryUpdated',
  })
  expenseCategoryUpdated() {
    return this.pubSub.asyncIterator('expenseCategoryUpdated');
  }

  @Subscription(() => ExpenseCategory, {
    name: 'expenseCategoryStatusUpdated',
  })
  expenseCategoryStatusUpdated() {
    return this.pubSub.asyncIterator('expenseCategoryStatusUpdated');
  }

  @Subscription(() => Ids, {
    name: 'expenseCategoriesRemoved',
    resolve: (payload) => payload.expenseCategoriesRemoved.ids,
  })
  expenseCategoriesRemoved() {
    return this.pubSub.asyncIterator('expenseCategoriesRemoved');
  }

  @Subscription(() => Ids, {
    name: 'expenseCategoriesRestored',
    resolve: (payload) => payload.expenseCategoriesRestored.ids,
  })
  expenseCategoriesRestored() {
    return this.pubSub.asyncIterator('expenseCategoriesRestored');
  }

  /////////////////////////////Recurring//////////////////////
  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseRecurring)
  async createRecurring(
    @Args('createExpenseRecurringInput')
    createExpenseRecurringInput: CreateExpenseRecurringInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<
      ExpenseRecurring,
      CreateExpenseRecurringInput
    >(
      'create',
      createExpenseRecurringInput,
      user,
      'expenseRecurring',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseRecurringCreated', {
      ['expenseRecurringCreated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseRecurring)
  async updateRecurring(
    @Args('updateExpenseRecurringInput')
    updateExpenseRecurringInput: UpdateExpenseRecurringInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<
      ExpenseRecurring,
      UpdateExpenseRecurringInput
    >(
      'update',
      updateExpenseRecurringInput,
      user,
      'expenseRecurring',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseRecurringUpdated', {
      ['expenseRecurringUpdated']: result,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseRecurring)
  async updateRecurringStatus(
    @Args('updateExpenseRecurringStatusInput')
    updateExpenseRecurringStatusInput: UpdateBaseStatusInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<ExpenseRecurring, UpdateBaseStatusInput>(
      'updateStatus',
      updateExpenseRecurringStatusInput,
      user,
      'expenseRecurring',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseRecurringStatusUpdated', {
      ['expenseRecurringStatusUpdated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedExpenseRecurring, { name: 'expenseRecurrings' })
  async findAllRecurring(
    @CurrentUser() user: IJwtPayload,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 10 }) perPage: number,
    @Args('delete', { type: () => DeleteFilter, nullable: true })
    deleteFilter: DeleteFilter,
    @Args('ids', { type: () => [ObjectIdScalar], nullable: true })
    ids: [ObjectId],
    @Args('projection', { type: () => GraphQLJSON, nullable: true })
    projection: Record<string, any>,
    @Args('sortBy', { type: () => GraphQLJSON, nullable: true })
    sortBy: Record<string, any>,
    @Args('status', { type: () => BaseStatus, nullable: true })
    status: BaseStatus,
    @Args('categoryId', { type: () => ObjectIdScalar, nullable: true })
    categoryId: ObjectId,
    @Args('accountId', { type: () => ObjectIdScalar, nullable: true })
    accountId: ObjectId,
  ): Promise<PaginatedExpenseRecurring> {
    const result = await sendRequest<PaginatedExpenseRecurring, any>(
      'findAll',
      {
        page,
        perPage,
        ids,
        deleteFilter,
        projection,
        sortBy,
        status,
        categoryId,
        accountId,
      },
      user,
      'expenseRecurring',
      this.expenseClient,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => ExpenseRecurring, { name: 'expenseRecurring' })
  async findOneRecurring(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: IJwtPayload,
  ) {
    return await sendRequest<ExpenseRecurring, string>(
      'findOne',
      id,
      user,
      'expenseRecurring',
      this.expenseClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async removeExpenseRecurring(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'remove',
      ids,
      user,
      'expenseRecurring',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseRecurringRemoved', {
      ['expenseRecurringRemoved']: ids,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async restoreExpenseRecurring(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'restore',
      ids,
      user,
      'expenseRecurring',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseRecurringRestored', {
      ['expenseRecurringRestored']: ids,
    });
    return result;
  }

  @Subscription(() => ExpenseRecurring, {
    name: 'expenseRecurringCreated',
  })
  expenseRecurringCreated() {
    return this.pubSub.asyncIterator('expenseRecurringCreated');
  }

  @Subscription(() => ExpenseRecurring, {
    name: 'expenseRecurringUpdated',
  })
  expenseRecurringUpdated() {
    return this.pubSub.asyncIterator('expenseRecurringUpdated');
  }

  @Subscription(() => ExpenseRecurring, {
    name: 'expenseRecurringStatusUpdated',
  })
  expenseRecurringStatusUpdated() {
    return this.pubSub.asyncIterator('expenseRecurringStatusUpdated');
  }

  @Subscription(() => Ids, {
    name: 'expenseRecurringRemoved',
    resolve: (payload) => payload.expenseRecurringRemoved.ids,
  })
  expenseRecurringRemoved() {
    return this.pubSub.asyncIterator('expenseRecurringRemoved');
  }

  @Subscription(() => Ids, {
    name: 'expenseRecurringRestored',
    resolve: (payload) => payload.expenseRecurringRestored.ids,
  })
  expenseRecurringRestored() {
    return this.pubSub.asyncIterator('expenseRecurringRestored');
  }

  /////////////////////////////Transaction//////////////////////
  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseTransaction)
  async createTransaction(
    @Args('createExpenseTransactionInput')
    createExpenseTransactionInput: CreateExpenseTransactionInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<
      ExpenseTransaction,
      CreateExpenseTransactionInput
    >(
      'create',
      createExpenseTransactionInput,
      user,
      'expenseTransaction',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseTransactionCreated', {
      ['expenseTransactionCreated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseTransaction)
  async updateTransaction(
    @Args('updateExpenseTransactionInput')
    updateExpenseTransactionInput: UpdateExpenseTransactionInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<
      ExpenseTransaction,
      UpdateExpenseTransactionInput
    >(
      'update',
      updateExpenseTransactionInput,
      user,
      'expenseTransaction',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseTransactionUpdated', {
      ['expenseTransactionUpdated']: result,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ExpenseTransaction)
  async updateTransactionStatus(
    @Args('updateExpenseTransactionStatusInput')
    updateExpenseTransactionStatusInput: UpdateExpenseTransactionStatusInput,
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = await sendRequest<
      ExpenseTransaction,
      UpdateExpenseTransactionStatusInput
    >(
      'updateStatus',
      updateExpenseTransactionStatusInput,
      user,
      'expenseTransaction',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseTransactionStatusUpdated', {
      ['expenseTransactionStatusUpdated']: result,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedExpenseTransaction, { name: 'expenseTransactions' })
  async findAllTransaction(
    @CurrentUser() user: IJwtPayload,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 10 }) perPage: number,
    @Args('delete', { type: () => DeleteFilter, nullable: true })
    deleteFilter: DeleteFilter,
    @Args('ids', { type: () => [ObjectIdScalar], nullable: true })
    ids: [ObjectId],
    @Args('projection', { type: () => GraphQLJSON, nullable: true })
    projection: Record<string, any>,
    @Args('sortBy', { type: () => GraphQLJSON, nullable: true })
    sortBy: Record<string, any>,
    @Args('status', { type: () => BaseStatus, nullable: true })
    status: BaseStatus,
    @Args('categoryId', { type: () => ObjectIdScalar, nullable: true })
    categoryId: ObjectId,
    @Args('accountId', { type: () => ObjectIdScalar, nullable: true })
    accountId: ObjectId,
    @Args('type', { type: () => TransactionType, nullable: true })
    type: TransactionType,
  ): Promise<PaginatedExpenseTransaction> {
    const result = await sendRequest<PaginatedExpenseTransaction, any>(
      'findAll',
      {
        page,
        perPage,
        ids,
        deleteFilter,
        projection,
        sortBy,
        status,
        categoryId,
        accountId,
        type,
      },
      user,
      'expenseTransaction',
      this.expenseClient,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => ExpenseTransaction, { name: 'expenseTransaction' })
  async findOneTransaction(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: IJwtPayload,
  ) {
    return await sendRequest<ExpenseTransaction, string>(
      'findOne',
      id,
      user,
      'expenseTransaction',
      this.expenseClient,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async removeExpenseTransaction(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'remove',
      ids,
      user,
      'expenseTransaction',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseTransactionRemoved', {
      ['expenseTransactionRemoved']: ids,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Number)
  async restoreExpenseTransaction(
    @Args('ids', { type: () => [ObjectIdScalar] }) ids: ObjectId[],
    @CurrentUser() user: IJwtPayload,
  ) {
    const result = sendRequest<number, ObjectId[]>(
      'restore',
      ids,
      user,
      'expenseTransaction',
      this.expenseClient,
    );
    await this.pubSub.publish('expenseTransactionRestored', {
      ['expenseTransactionRestored']: ids,
    });
    return result;
  }

  @Subscription(() => ExpenseTransaction, {
    name: 'expenseTransactionCreated',
  })
  expenseTransactionCreated() {
    return this.pubSub.asyncIterator('expenseTransactionCreated');
  }

  @Subscription(() => ExpenseTransaction, {
    name: 'expenseTransactionUpdated',
  })
  expenseTransactionUpdated() {
    return this.pubSub.asyncIterator('expenseTransactionUpdated');
  }

  @Subscription(() => ExpenseTransaction, {
    name: 'expenseTransactionStatusUpdated',
  })
  expenseTransactionStatusUpdated() {
    return this.pubSub.asyncIterator('expenseTransactionStatusUpdated');
  }

  @Subscription(() => Ids, {
    name: 'expenseTransactionRemoved',
    resolve: (payload) => payload.expenseTransactionRemoved.ids,
  })
  expenseTransactionRemoved() {
    return this.pubSub.asyncIterator('expenseTransactionRemoved');
  }

  @Subscription(() => Ids, {
    name: 'expenseTransactionRestored',
    resolve: (payload) => payload.expenseTransactionRestored.ids,
  })
  expenseTransactionRestored() {
    return this.pubSub.asyncIterator('expenseTransactionRestored');
  }
}
