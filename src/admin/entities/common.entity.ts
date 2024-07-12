import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectIdScalar } from '../../common/objectId.sclar';
import { GraphQLDateTimeISO } from 'graphql-scalars';

@ObjectType({ description: 'BaseSchema' })
export class BaseSchema {
  @Field(() => String)
  id: string;
  @Field(() => ObjectIdScalar)
  createdBy: string;
  @Field(() => ObjectIdScalar)
  updatedBy: string;
  @Field(() => GraphQLDateTimeISO, { nullable: true, defaultValue: null })
  deletedAt?: Date;
  @Field(() => GraphQLDateTimeISO, { nullable: true, defaultValue: null })
  createdAt: Date;
  @Field(() => GraphQLDateTimeISO, { nullable: true, defaultValue: null })
  updatedAt?: Date;
}

@ObjectType()
export class Address {
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
