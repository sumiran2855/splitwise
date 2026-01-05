export enum SplitType {
  EQUAL = 'EQUAL',
  EXACT = 'EXACT',
  PERCENTAGE = 'PERCENTAGE',
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  PARTIALLY_SETTLED = 'PARTIALLY_SETTLED',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseUser {
  passwordHash: string;
  isEmailVerified: boolean;
  role: UserRole;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  groupId?: string;
  splitType: SplitType;
  status: ExpenseStatus;
  participants: ExpenseParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseParticipant {
  userId: string;
  amount?: number;
  percentage?: number;
  paidAmount: number;
  owesAmount: number;
}

export interface Balance {
  id: string;
  userId: string;
  owesTo: string;
  amount: number;
  groupId?: string;
  lastUpdated: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateExpenseDto {
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  groupId?: string;
  splitType: SplitType;
  participants: Omit<ExpenseParticipant, 'paidAmount' | 'owesAmount'>[];
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  memberIds: string[];
}
