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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  street: Scalars['String']['output'];
  city: Scalars['String']['output'];
  state: Scalars['String']['output'];
  pinCode: Scalars['Float']['output'];
  country: Scalars['String']['output'];
};

export type Ids = {
  __typename?: 'Ids';
  ids: Array<Scalars['ObjectId']['output']>;
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
  nextPage?: Maybe<Scalars['Int']['output']>;
  pagingCounter: Scalars['Int']['output'];
  prevPage?: Maybe<Scalars['Int']['output']>;
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

export type ExpenseAccount = {
  __typename?: 'ExpenseAccount';
  id: Scalars['String']['output'];
  createdBy: Scalars['ObjectId']['output'];
  updatedBy: Scalars['ObjectId']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  type: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  status: BaseStatus;
};

/** Pagination wrapper */
export type PaginatedExpenseAccount = {
  __typename?: 'PaginatedExpenseAccount';
  docs: Array<ExpenseAccount>;
  paginate: Pagination;
};

export type ExpenseBudget = {
  __typename?: 'ExpenseBudget';
  id: Scalars['String']['output'];
  createdBy: Scalars['ObjectId']['output'];
  updatedBy: Scalars['ObjectId']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  categoryId: Scalars['ObjectId']['output'];
  amount: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  status: BaseStatus;
};

/** Pagination wrapper */
export type PaginatedExpenseBudget = {
  __typename?: 'PaginatedExpenseBudget';
  docs: Array<ExpenseBudget>;
  paginate: Pagination;
};

export type ExpenseCategory = {
  __typename?: 'ExpenseCategory';
  id: Scalars['String']['output'];
  createdBy: Scalars['ObjectId']['output'];
  updatedBy: Scalars['ObjectId']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  status: BaseStatus;
};

/** Pagination wrapper */
export type PaginatedExpenseCategory = {
  __typename?: 'PaginatedExpenseCategory';
  docs: Array<ExpenseCategory>;
  paginate: Pagination;
};

export type ExpenseTransaction = {
  __typename?: 'ExpenseTransaction';
  id: Scalars['String']['output'];
  createdBy: Scalars['ObjectId']['output'];
  updatedBy: Scalars['ObjectId']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  accountId: Scalars['ObjectId']['output'];
  categoryId: Scalars['ObjectId']['output'];
  type: TransactionType;
  amount: Scalars['Float']['output'];
  isAutoApplied: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  status: TransactionStatus;
};

export enum TransactionType {
  income = 'income',
  expense = 'expense'
}

export enum TransactionStatus {
  complete = 'complete',
  fail = 'fail',
  inProcess = 'inProcess'
}

/** Pagination wrapper */
export type PaginatedExpenseTransaction = {
  __typename?: 'PaginatedExpenseTransaction';
  docs: Array<ExpenseTransaction>;
  paginate: Pagination;
};

export type ExpenseRecurring = {
  __typename?: 'ExpenseRecurring';
  id: Scalars['String']['output'];
  createdBy: Scalars['ObjectId']['output'];
  updatedBy: Scalars['ObjectId']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  categoryId: Scalars['ObjectId']['output'];
  accountId: Scalars['ObjectId']['output'];
  dateOrTime: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  repeatType: RepeatType;
  status: BaseStatus;
};

export enum RepeatType {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly'
}

/** Pagination wrapper */
export type PaginatedExpenseRecurring = {
  __typename?: 'PaginatedExpenseRecurring';
  docs: Array<ExpenseRecurring>;
  paginate: Pagination;
};

export type Query = {
  __typename?: 'Query';
  expenseAccounts: PaginatedExpenseAccount;
  expenseAccount: ExpenseAccount;
  expenseBudgets: PaginatedExpenseBudget;
  expenseBudget: ExpenseBudget;
  expenseCategories: PaginatedExpenseCategory;
  expenseCategory: ExpenseCategory;
  expenseRecurrings: PaginatedExpenseRecurring;
  expenseRecurring: ExpenseRecurring;
  expenseTransactions: PaginatedExpenseTransaction;
  expenseTransaction: ExpenseTransaction;
  getProfile: User;
  users: PaginatedUser;
  user: User;
};


export type QueryexpenseAccountsArgs = {
  page?: Scalars['Int']['input'];
  perPage?: Scalars['Int']['input'];
  delete?: InputMaybe<DeleteFilter>;
  ids?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  status?: InputMaybe<BaseStatus>;
  type?: InputMaybe<Scalars['String']['input']>;
  projection?: InputMaybe<Scalars['JSON']['input']>;
  sortBy?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryexpenseAccountArgs = {
  id: Scalars['String']['input'];
};


export type QueryexpenseBudgetsArgs = {
  page?: Scalars['Int']['input'];
  perPage?: Scalars['Int']['input'];
  delete?: InputMaybe<DeleteFilter>;
  ids?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  projection?: InputMaybe<Scalars['JSON']['input']>;
  sortBy?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<BaseStatus>;
  categoryId?: InputMaybe<Scalars['ObjectId']['input']>;
};


export type QueryexpenseBudgetArgs = {
  id: Scalars['String']['input'];
};


export type QueryexpenseCategoriesArgs = {
  page?: Scalars['Int']['input'];
  perPage?: Scalars['Int']['input'];
  delete?: InputMaybe<DeleteFilter>;
  ids?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  projection?: InputMaybe<Scalars['JSON']['input']>;
  sortBy?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<BaseStatus>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryexpenseCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryexpenseRecurringsArgs = {
  page?: Scalars['Int']['input'];
  perPage?: Scalars['Int']['input'];
  delete?: InputMaybe<DeleteFilter>;
  ids?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  projection?: InputMaybe<Scalars['JSON']['input']>;
  sortBy?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<BaseStatus>;
  categoryId?: InputMaybe<Scalars['ObjectId']['input']>;
  accountId?: InputMaybe<Scalars['ObjectId']['input']>;
};


export type QueryexpenseRecurringArgs = {
  id: Scalars['String']['input'];
};


export type QueryexpenseTransactionsArgs = {
  page?: Scalars['Int']['input'];
  perPage?: Scalars['Int']['input'];
  delete?: InputMaybe<DeleteFilter>;
  ids?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  projection?: InputMaybe<Scalars['JSON']['input']>;
  sortBy?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<BaseStatus>;
  categoryId?: InputMaybe<Scalars['ObjectId']['input']>;
  accountId?: InputMaybe<Scalars['ObjectId']['input']>;
  type?: InputMaybe<TransactionType>;
};


export type QueryexpenseTransactionArgs = {
  id: Scalars['String']['input'];
};


export type QueryusersArgs = {
  page?: Scalars['Int']['input'];
  perPage?: Scalars['Int']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
  delete?: InputMaybe<DeleteFilter>;
  ids?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  status?: InputMaybe<BaseStatus>;
  projection?: InputMaybe<Scalars['JSON']['input']>;
  sortBy?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryuserArgs = {
  id: Scalars['String']['input'];
};

export enum DeleteFilter {
  include = 'include',
  exclude = 'exclude',
  only = 'only'
}

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: ExpenseAccount;
  updateAccount: ExpenseAccount;
  updateAccountStatus: ExpenseAccount;
  removeAccounts: Scalars['Float']['output'];
  restoreAccounts: Scalars['Float']['output'];
  createBudget: ExpenseBudget;
  updateBudget: ExpenseBudget;
  updateBudgetStatus: ExpenseBudget;
  removeExpenseBudget: Scalars['Float']['output'];
  restoreExpenseBudget: Scalars['Float']['output'];
  createCategory: ExpenseCategory;
  updateCategory: ExpenseCategory;
  updateCategoryStatus: ExpenseCategory;
  removeExpenseCategory: Scalars['Float']['output'];
  restoreExpenseCategory: Scalars['Float']['output'];
  createRecurring: ExpenseRecurring;
  updateRecurring: ExpenseRecurring;
  updateRecurringStatus: ExpenseRecurring;
  removeExpenseRecurring: Scalars['Float']['output'];
  restoreExpenseRecurring: Scalars['Float']['output'];
  createTransaction: ExpenseTransaction;
  updateTransaction: ExpenseTransaction;
  updateTransactionStatus: ExpenseTransaction;
  removeExpenseTransaction: Scalars['Float']['output'];
  restoreExpenseTransaction: Scalars['Float']['output'];
  loginUser: AuthResponse;
  refreshToken: AuthResponse;
  createUsers: User;
  updateUserPersonal: User;
  updateUserPassword: Scalars['Boolean']['output'];
  updateUserName: User;
  updateStatus: User;
  removeUsers: Scalars['Float']['output'];
  restoreUsers: Scalars['Float']['output'];
};


export type MutationcreateAccountArgs = {
  createExpenseAccountInput: CreateExpenseAccountInput;
};


export type MutationupdateAccountArgs = {
  updateExpenseAccountInput: UpdateExpenseAccountInput;
};


export type MutationupdateAccountStatusArgs = {
  updateExpenseAccountStatusInput: UpdateBaseStatusInput;
};


export type MutationremoveAccountsArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationrestoreAccountsArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationcreateBudgetArgs = {
  createExpenseBudgetInput: CreateExpenseBudgetInput;
};


export type MutationupdateBudgetArgs = {
  updateExpenseBudgetInput: UpdateExpenseBudgetInput;
};


export type MutationupdateBudgetStatusArgs = {
  updateExpenseBudgetStatusInput: UpdateBaseStatusInput;
};


export type MutationremoveExpenseBudgetArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationrestoreExpenseBudgetArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationcreateCategoryArgs = {
  createExpenseCategoryInput: CreateExpenseCategoryInput;
};


export type MutationupdateCategoryArgs = {
  updateExpenseCategoryInput: UpdateExpenseCategoryInput;
};


export type MutationupdateCategoryStatusArgs = {
  updateExpenseCategoryStatusInput: UpdateBaseStatusInput;
};


export type MutationremoveExpenseCategoryArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationrestoreExpenseCategoryArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationcreateRecurringArgs = {
  createExpenseRecurringInput: CreateExpenseRecurringInput;
};


export type MutationupdateRecurringArgs = {
  updateExpenseRecurringInput: UpdateExpenseRecurringInput;
};


export type MutationupdateRecurringStatusArgs = {
  updateExpenseRecurringStatusInput: UpdateBaseStatusInput;
};


export type MutationremoveExpenseRecurringArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationrestoreExpenseRecurringArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationcreateTransactionArgs = {
  createExpenseTransactionInput: CreateExpenseTransactionInput;
};


export type MutationupdateTransactionArgs = {
  updateExpenseTransactionInput: UpdateExpenseTransactionInput;
};


export type MutationupdateTransactionStatusArgs = {
  updateExpenseTransactionStatusInput: UpdateExpenseTransactionStatusInput;
};


export type MutationremoveExpenseTransactionArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationrestoreExpenseTransactionArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationloginUserArgs = {
  loginUserInput: LoginUserInput;
};


export type MutationrefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
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


export type MutationupdateStatusArgs = {
  updateUserStatus: UpdateBaseStatusInput;
};


export type MutationremoveUsersArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};


export type MutationrestoreUsersArgs = {
  ids: Array<Scalars['ObjectId']['input']>;
};

export type CreateExpenseAccountInput = {
  type: Scalars['String']['input'];
  balance: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseAccountInput = {
  id: Scalars['String']['input'];
  type: Scalars['String']['input'];
  balance: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBaseStatusInput = {
  id: Scalars['ObjectId']['input'];
  status: BaseStatus;
};

export type CreateExpenseBudgetInput = {
  categoryId: Scalars['ObjectId']['input'];
  amount: Scalars['Float']['input'];
  startDate: Scalars['String']['input'];
};

export type UpdateExpenseBudgetInput = {
  id: Scalars['String']['input'];
  categoryId: Scalars['ObjectId']['input'];
  amount: Scalars['Float']['input'];
  startDate: Scalars['String']['input'];
};

export type CreateExpenseCategoryInput = {
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseCategoryInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type CreateExpenseRecurringInput = {
  categoryId: Scalars['ObjectId']['input'];
  accountId: Scalars['ObjectId']['input'];
  dateOrTime: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  repeatType: RepeatType;
};

export type UpdateExpenseRecurringInput = {
  id: Scalars['String']['input'];
  categoryId: Scalars['ObjectId']['input'];
  accountId: Scalars['ObjectId']['input'];
  dateOrTime: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  repeatType: RepeatType;
};

export type CreateExpenseTransactionInput = {
  accountId: Scalars['ObjectId']['input'];
  categoryId: Scalars['ObjectId']['input'];
  type: TransactionType;
  amount: Scalars['Float']['input'];
  isAutoApplied: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseTransactionInput = {
  id: Scalars['String']['input'];
  accountId: Scalars['ObjectId']['input'];
  categoryId: Scalars['ObjectId']['input'];
  type: TransactionType;
  amount: Scalars['Float']['input'];
  isAutoApplied: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseTransactionStatusInput = {
  id: Scalars['String']['input'];
  status: TransactionStatus;
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
  expenseAccountCreated: ExpenseAccount;
  expenseAccountUpdated: ExpenseAccount;
  expenseAccountStatusUpdated: ExpenseAccount;
  expenseAccountsRemoved: Ids;
  expenseAccountsRestore: Ids;
  expenseBudgetCreated: ExpenseBudget;
  expenseBudgetUpdated: ExpenseBudget;
  expenseBudgetStatusUpdated: ExpenseBudget;
  expenseBudgetsRemoved: Ids;
  expenseBudgetsRestore: Ids;
  expenseCategoryCreated: ExpenseCategory;
  expenseCategoryUpdated: ExpenseCategory;
  expenseCategoryStatusUpdated: ExpenseCategory;
  expenseCategoriesRemoved: Ids;
  expenseCategoriesRestored: Ids;
  expenseRecurringCreated: ExpenseRecurring;
  expenseRecurringUpdated: ExpenseRecurring;
  expenseRecurringStatusUpdated: ExpenseRecurring;
  expenseRecurringRemoved: Ids;
  expenseRecurringRestored: Ids;
  expenseTransactionCreated: ExpenseTransaction;
  expenseTransactionUpdated: ExpenseTransaction;
  expenseTransactionStatusUpdated: ExpenseTransaction;
  expenseTransactionRemoved: Ids;
  expenseTransactionRestored: Ids;
  userCreated: User;
  userStatusUpdated: User;
  userDeleted: Ids;
  userRestore: Ids;
  userPasswordUpdated: Scalars['Boolean']['output'];
  userNameUpdated: User;
  userPersonalUpdated: User;
};

export const EXPENSE_ACCOUNT_CREATED = 'expenseAccountCreated';
export const EXPENSE_ACCOUNT_UPDATED = 'expenseAccountUpdated';
export const EXPENSE_ACCOUNT_STATUS_UPDATED = 'expenseAccountStatusUpdated';
export const EXPENSE_ACCOUNTS_REMOVED = 'expenseAccountsRemoved';
export const EXPENSE_ACCOUNTS_RESTORE = 'expenseAccountsRestore';
export const EXPENSE_BUDGET_CREATED = 'expenseBudgetCreated';
export const EXPENSE_BUDGET_UPDATED = 'expenseBudgetUpdated';
export const EXPENSE_BUDGET_STATUS_UPDATED = 'expenseBudgetStatusUpdated';
export const EXPENSE_BUDGETS_REMOVED = 'expenseBudgetsRemoved';
export const EXPENSE_BUDGETS_RESTORE = 'expenseBudgetsRestore';
export const EXPENSE_CATEGORY_CREATED = 'expenseCategoryCreated';
export const EXPENSE_CATEGORY_UPDATED = 'expenseCategoryUpdated';
export const EXPENSE_CATEGORY_STATUS_UPDATED = 'expenseCategoryStatusUpdated';
export const EXPENSE_CATEGORIES_REMOVED = 'expenseCategoriesRemoved';
export const EXPENSE_CATEGORIES_RESTORED = 'expenseCategoriesRestored';
export const EXPENSE_RECURRING_CREATED = 'expenseRecurringCreated';
export const EXPENSE_RECURRING_UPDATED = 'expenseRecurringUpdated';
export const EXPENSE_RECURRING_STATUS_UPDATED = 'expenseRecurringStatusUpdated';
export const EXPENSE_RECURRING_REMOVED = 'expenseRecurringRemoved';
export const EXPENSE_RECURRING_RESTORED = 'expenseRecurringRestored';
export const EXPENSE_TRANSACTION_CREATED = 'expenseTransactionCreated';
export const EXPENSE_TRANSACTION_UPDATED = 'expenseTransactionUpdated';
export const EXPENSE_TRANSACTION_STATUS_UPDATED = 'expenseTransactionStatusUpdated';
export const EXPENSE_TRANSACTION_REMOVED = 'expenseTransactionRemoved';
export const EXPENSE_TRANSACTION_RESTORED = 'expenseTransactionRestored';
export const USER_CREATED = 'userCreated';
export const USER_STATUS_UPDATED = 'userStatusUpdated';
export const USER_DELETED = 'userDeleted';
export const USER_RESTORE = 'userRestore';
export const USER_PASSWORD_UPDATED = 'userPasswordUpdated';
export const USER_NAME_UPDATED = 'userNameUpdated';
export const USER_PERSONAL_UPDATED = 'userPersonalUpdated';