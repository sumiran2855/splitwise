import { User, CreateUserDto, LoginDto, UserRole, PaginationParams, PaginatedResponse } from '../../types';

export interface IUserService {
  createUser(userData: CreateUserDto): Promise<User>;
  authenticateUser(loginData: LoginDto): Promise<{ user: User; token: string }>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'passwordHash'>>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(params: PaginationParams): Promise<PaginatedResponse<User>>;
  updateUserRole(id: string, role: UserRole): Promise<User>;
  verifyUserEmail(id: string): Promise<User>;
  changeUserPassword(id: string, oldPassword: string, newPassword: string): Promise<User>;
  isEmailAvailable(email: string, excludeUserId?: string): Promise<boolean>;
}
