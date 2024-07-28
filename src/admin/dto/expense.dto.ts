//===============Account ===================//
import { Field, InputType } from '@nestjs/graphql';
import { ObjectIdScalar } from '../../common/objectId.sclar';
import { ObjectId } from 'mongodb';
import { RepeatType, TransactionStatus, TransactionType } from './common.dto';

@InputType()
export class CreateExpenseAccountInput {
  @Field(() => String)
  type: string;
  @Field(() => Number)
  balance: number;
  @Field(() => String, { nullable: true })
  description: string;
}

@InputType()
export class UpdateExpenseAccountInput {
  @Field(() => String)
  id: string;
  @Field(() => String)
  type: string;
  @Field(() => Number)
  balance: number;
  @Field(() => String, { nullable: true })
  description: string;
}

//===============Budget ===================//

@InputType()
export class CreateExpenseBudgetInput {
  @Field(() => ObjectIdScalar)
  categoryId: ObjectId;
  @Field(() => Number)
  amount: number;
  @Field(() => String)
  startDate: string;
}

@InputType()
export class UpdateExpenseBudgetInput {
  @Field(() => String)
  id: string;
  @Field(() => ObjectIdScalar)
  categoryId: ObjectId;
  @Field(() => Number)
  amount: number;
  @Field(() => String)
  startDate: string;
}

//==========Category===================//

@InputType()
export class CreateExpenseCategoryInput {
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  description: string;
}

@InputType()
export class UpdateExpenseCategoryInput {
  @Field(() => String)
  id: string;
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  description: string;
}

//=============Transaction===========//
@InputType()
export class CreateExpenseTransactionInput {
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
}

@InputType()
export class UpdateExpenseTransactionInput {
  @Field(() => String)
  id: string;
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
}

@InputType()
export class UpdateExpenseTransactionStatusInput {
  @Field(() => String)
  id: string;
  @Field(() => TransactionStatus)
  status: TransactionStatus;
}

//==============Recurring============//
@InputType()
export class CreateExpenseRecurringInput {
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
}

@InputType()
export class UpdateExpenseRecurringInput {
  @Field(() => String)
  id: string;
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
}
