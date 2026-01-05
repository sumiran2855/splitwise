import { User, UserRole, PaginationParams, PaginatedResponse } from '../../types';

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(params: PaginationParams): Promise<PaginatedResponse<User>>;
  updateRole(id: string, role: UserRole): Promise<User>;
  verifyEmail(id: string): Promise<User>;
  updatePassword(id: string, passwordHash: string): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
}
