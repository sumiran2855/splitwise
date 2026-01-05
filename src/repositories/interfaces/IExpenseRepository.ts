import { Expense, ExpenseStatus, PaginationParams, PaginatedResponse } from '../../types';

export interface IExpenseRepository {
  create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense>;
  findById(id: string): Promise<Expense | null>;
  update(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): Promise<Expense>;
  delete(id: string): Promise<void>;
  findByUserId(userId: string, params: PaginationParams): Promise<PaginatedResponse<Expense>>;
  findByGroupId(groupId: string, params: PaginationParams): Promise<PaginatedResponse<Expense>>;
  findByPaidBy(userId: string, params: PaginationParams): Promise<PaginatedResponse<Expense>>;
  findByStatus(status: ExpenseStatus, params: PaginationParams): Promise<PaginatedResponse<Expense>>;
  findAll(params: PaginationParams): Promise<PaginatedResponse<Expense>>;
  updateStatus(id: string, status: ExpenseStatus): Promise<Expense>;
  updateParticipantPayment(id: string, userId: string, paidAmount: number): Promise<Expense>;
  findExpensesBetweenUsers(user1Id: string, user2Id: string): Promise<Expense[]>;
}
