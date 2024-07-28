import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseStatus,
  RepeatType,
  TransactionStatus,
  TransactionType,
} from '../dto/common.dto';
import { BaseSchema } from './common.entity';
import { Pagination } from './users.entity';
import { ObjectIdScalar } from '../../common/objectId.sclar';
import { ObjectId } from 'mongodb';

@ObjectType()
export class ExpenseAccount extends BaseSchema {
  @Field(() => String)
  type: string;
  @Field(() => Number)
  balance: number;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => BaseStatus)
  status: BaseStatus;
}

@ObjectType({ description: 'Pagination wrapper' })
export class PaginatedExpenseAccount {
  @Field(() => [ExpenseAccount])
  docs: ExpenseAccount[];
  @Field(() => Pagination)
  paginate: Pagination;
}

@ObjectType()
export class ExpenseBudget extends BaseSchema {
  @Field(() => ObjectIdScalar)
  categoryId: ObjectId;
  @Field(() => Number)
  amount: number;
  @Field(() => String)
  startDate: string;
  @Field(() => String)
  endDate: string;
  @Field(() => BaseStatus)
  status: BaseStatus;
}

@ObjectType({ description: 'Pagination wrapper' })
export class PaginatedExpenseBudget {
  @Field(() => [ExpenseBudget])
  docs: ExpenseBudget[];
  @Field(() => Pagination)
  paginate: Pagination;
}

@ObjectType()
export class ExpenseCategory extends BaseSchema {
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => BaseStatus)
  status: BaseStatus;
}

@ObjectType({ description: 'Pagination wrapper' })
export class PaginatedExpenseCategory {
  @Field(() => [ExpenseCategory])
  docs: ExpenseCategory[];
  @Field(() => Pagination)
  paginate: Pagination;
}

@ObjectType()
export class ExpenseTransaction extends BaseSchema {
  @Field(() => ObjectIdScalar)
  accountId: ObjectId;
  @Field(() => ObjectIdScalar)
  categoryId: ObjectId;
  @Field(() => TransactionType)
  type: TransactionType;
  @Field(() => Number)
  amount: number;
  @Field(() => Boolean)
  isAutoApplied: boolean;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => TransactionStatus)
  status: TransactionStatus;
}

@ObjectType({ description: 'Pagination wrapper' })
export class PaginatedExpenseTransaction {
  @Field(() => [ExpenseTransaction])
  docs: ExpenseTransaction[];
  @Field(() => Pagination)
  paginate: Pagination;
}

@ObjectType()
export class ExpenseRecurring extends BaseSchema {
  @Field(() => ObjectIdScalar)
  categoryId: ObjectId;
  @Field(() => ObjectIdScalar)
  accountId: ObjectId;
  @Field(() => String)
  dateOrTime: string;
  @Field(() => Number)
  amount: number;
  @Field(() => RepeatType)
  repeatType: RepeatType;
  @Field(() => BaseStatus)
  status: BaseStatus;
}

@ObjectType({ description: 'Pagination wrapper' })
export class PaginatedExpenseRecurring {
  @Field(() => [ExpenseRecurring])
  docs: ExpenseRecurring[];
  @Field(() => Pagination)
  paginate: Pagination;
}
