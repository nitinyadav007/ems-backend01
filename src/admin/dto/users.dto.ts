import { Field, InputType } from '@nestjs/graphql';
import { AddressInput, BaseStatus, Gender } from './common.dto';

@InputType()
class PersonalInput {
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
  @Field(() => AddressInput)
  address: AddressInput;
}

@InputType()
export class CreateUserInput {
  @Field(() => PersonalInput)
  personal: PersonalInput;
  @Field(() => String)
  username: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  confirmPassword: string;
  @Field(() => BaseStatus)
  status: BaseStatus;
}

@InputType()
export class UpdateUserPersonalInput {
  @Field(() => String)
  id: string;
  @Field(() => PersonalInput)
  personal: PersonalInput;
}

@InputType()
export class UpdateUserPasswordInput {
  @Field(() => String)
  id: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  confirmPassword: string;
}

@InputType()
export class UpdateUserNameInput {
  @Field(() => String)
  id: string;
  @Field(() => String)
  username: string;
}

@InputType()
export class LoginUserInput {
  @Field(() => String)
  username: string;
  @Field(() => String)
  password: string;
}

@InputType()
export class UpdateBaseStatus {
  @Field(() => String)
  id: string;
  @Field(() => BaseStatus)
  status: BaseStatus;
}
