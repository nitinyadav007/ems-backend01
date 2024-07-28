import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { ObjectIdScalar } from '../../common/objectId.sclar';
import { GraphQLJSON } from 'graphql-scalars';
import { ObjectId } from 'mongodb';

export enum BaseStatus {
  active = 'active',
  inactive = 'inactive',
}

export enum TransactionStatus {
  complete = 'complete',
  fail = 'fail',
  inProcess = 'inProcess',
}

export enum RepeatType {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

export enum TransactionType {
  income = 'income',
  expense = 'expense',
}

export enum DeleteFilter {
  include = 'include',
  exclude = 'exclude',
  only = 'only',
}

registerEnumType(RepeatType, {
  name: 'RepeatType',
});
registerEnumType(DeleteFilter, {
  name: 'DeleteFilter',
});
registerEnumType(BaseStatus, {
  name: 'BaseStatus', // this one is mandatory
});
registerEnumType(TransactionType, {
  name: 'TransactionType', // this one is mandatory
});
registerEnumType(TransactionStatus, {
  name: 'TransactionStatus', // this one is mandatory
});

export enum Gender {
  male = 'male',
  female = 'female',
  others = 'others',
}

registerEnumType(Gender, {
  name: 'Gender', // this one is mandatory
});

@InputType()
export class AddressInput {
  @Field(() => String)
  street: string;
  @Field(() => String)
  city: string;
  @Field(() => String)
  state: string;
  @Field(() => Number)
  pinCode: number;
  @Field(() => String)
  country: string;
}

@InputType()
export class UpdateBaseStatusInput {
  @Field(() => ObjectIdScalar)
  id: ObjectId;
  @Field(() => BaseStatus)
  status: BaseStatus;
}

@InputType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  perPage: number;
}

@InputType()
export class FindAllUsersInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  perPage: number;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => DeleteFilter, { nullable: true })
  deleteFilter?: DeleteFilter;

  @Field(() => [ObjectIdScalar], { nullable: true })
  ids?: [ObjectId];

  @Field(() => BaseStatus, { nullable: true })
  status?: BaseStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  projection?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  sortBy?: Record<string, any>;
}

@ObjectType()
export class Ids {
  @Field(() => [ObjectIdScalar])
  ids: [ObjectId];
}
