export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** MongoDB ObjectId custom scalar type */
  ObjectId: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  street: Scalars['String']['output'];
  city: Scalars['String']['output'];
  state: Scalars['String']['output'];
  pinCode: Scalars['Float']['output'];
  country: Scalars['String']['output'];
};

export type Personal = {
  __typename?: 'Personal';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  DOB: Scalars['String']['output'];
  profileImage: Scalars['String']['output'];
  coverImage: Scalars['String']['output'];
  gender: Gender;
  email: Array<Scalars['String']['output']>;
  phone: Array<Scalars['String']['output']>;
  address: Address;
};

export enum Gender {
  male = 'male',
  female = 'female',
  others = 'others'
}

export type User = {
  __typename?: 'User';
  id: Scalars['String']['output'];
  createdBy: Scalars['ObjectId']['output'];
  updatedBy: Scalars['ObjectId']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  personal: Personal;
  username: Scalars['String']['output'];
  password: Scalars['String']['output'];
  confirmPassword: Scalars['String']['output'];
  status: BaseStatus;
};

export enum BaseStatus {
  active = 'active',
  inactive = 'inactive'
}

/** Pagination wrapper */
export type Pagination = {
  __typename?: 'Pagination';
  perPage: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevPage: Scalars['Boolean']['output'];
  nextPage: Scalars['Int']['output'];
  pagingCounter: Scalars['Int']['output'];
  prevPage: Scalars['Int']['output'];
  totalDocs: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

/** Pagination wrapper */
export type PaginatedUser = {
  __typename?: 'PaginatedUser';
  docs: Array<User>;
  paginate: Pagination;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getProfile: User;
  Users: PaginatedUser;
  User: User;
};


export type QueryUsersArgs = {
  page?: Scalars['Int']['input'];
  perPage?: Scalars['Int']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  status?: InputMaybe<BaseStatus>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  loginUser: AuthResponse;
  createUsers: User;
  updateUserPersonal: User;
  updateUserPassword: User;
  updateUserName: User;
  removeUsers: User;
};


export type MutationloginUserArgs = {
  loginUserInput: LoginUserInput;
};


export type MutationcreateUsersArgs = {
  createUsersInput: CreateUserInput;
};


export type MutationupdateUserPersonalArgs = {
  updateUserPersonal: UpdateUserPersonalInput;
};


export type MutationupdateUserPasswordArgs = {
  updateUserPassword: UpdateUserPasswordInput;
};


export type MutationupdateUserNameArgs = {
  updateUserName: UpdateUserNameInput;
};


export type MutationremoveUsersArgs = {
  id: Scalars['String']['input'];
};

export type LoginUserInput = {
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateUserInput = {
  personal: PersonalInput;
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  confirmPassword: Scalars['String']['input'];
  status: BaseStatus;
};

export type PersonalInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  DOB: Scalars['String']['input'];
  profileImage: Scalars['String']['input'];
  coverImage: Scalars['String']['input'];
  gender: Gender;
  email: Array<Scalars['String']['input']>;
  phone: Array<Scalars['String']['input']>;
  address: AddressInput;
};

export type AddressInput = {
  street: Scalars['String']['input'];
  city: Scalars['String']['input'];
  state: Scalars['String']['input'];
  pinCode: Scalars['Float']['input'];
  country: Scalars['String']['input'];
};

export type UpdateUserPersonalInput = {
  id: Scalars['String']['input'];
  personal: PersonalInput;
};

export type UpdateUserPasswordInput = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
  confirmPassword: Scalars['String']['input'];
};

export type UpdateUserNameInput = {
  id: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  userUpdated: User;
};

export const USER_UPDATED = 'userUpdated';