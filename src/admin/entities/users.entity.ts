import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Address, BaseSchema } from './common.entity';
import { BaseStatus, Gender } from '../dto/common.dto';

@ObjectType()
class Personal {
  @Field(() => String)
  firstName: string;
  @Field(() => String)
  lastName: string;
  @Field(() => String)
  DOB: string;
  @Field(() => String)
  profileImage: string;
  @Field(() => String)
  coverImage: string;
  @Field(() => Gender)
  gender: Gender;
  @Field(() => [String])
  email: string[];
  @Field(() => [String])
  phone: string[];
  @Field(() => Address)
  address: Address;
}

@ObjectType()
export class User extends BaseSchema {
  @Field(() => Personal)
  personal: Personal;
  @Field(() => String)
  username: string;
  @Field(() => BaseStatus)
  status: BaseStatus;
}

@ObjectType()
export class Test {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  accessToken: string;
  @Field(() => String)
  refreshToken: string;
}

@ObjectType({ description: 'Pagination wrapper' })
export class Pagination {
  @Field(() => Int)
  perPage: number;
  @Field(() => Int)
  page: number;
  @Field(() => Boolean, { defaultValue: false })
  hasNextPage: boolean;
  @Field(() => Boolean, { defaultValue: false })
  hasPrevPage: boolean;
  @Field(() => Int, { nullable: true })
  nextPage: number;
  @Field(() => Int, { defaultValue: 1 })
  pagingCounter: number;
  @Field(() => Int, { nullable: true })
  prevPage: number;
  @Field(() => Int)
  totalDocs: number;
  @Field(() => Int, { defaultValue: 1 })
  totalPages: number;
}

@ObjectType({ description: 'Pagination wrapper' })
export class PaginatedUser {
  @Field(() => [User])
  docs: User[];
  @Field(() => Pagination)
  paginate: Pagination;
}

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  accessToken: string;
  @Field(() => String)
  refreshToken: string;
}
