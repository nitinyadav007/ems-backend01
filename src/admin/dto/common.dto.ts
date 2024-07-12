import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { SchemaTypes, Types } from 'mongoose';

export enum BaseStatus {
  active = 'active',
  inactive = 'inactive',
}

registerEnumType(BaseStatus, {
  name: 'BaseStatus', // this one is mandatory
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
  @Field(() => SchemaTypes.ObjectId)
  id: Types.ObjectId;
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
