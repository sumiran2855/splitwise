import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, CreateUserDto, LoginDto, UserRole, PaginationParams, PaginatedResponse } from '../../types';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IUserService } from '../interfaces/IUserService';
import { Types } from 'mongoose';

export class UserService implements IUserService {
  private readonly userRepository: IUserRepository;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await this.hashPassword(userData.password);
    
    const newUser = await this.userRepository.create({
      email: userData.email.toLowerCase(),
      name: userData.name,
      passwordHash,
      phoneNumber: userData.phoneNumber,
      isEmailVerified: false,
      role: UserRole.USER,
      profileId: userData.profileId,
    });

    return newUser;
  }

  async authenticateUser(loginData: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(loginData.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    
    const { passwordHash, ...safeUser } = user;
    
    return { user: safeUser as User, token };
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    
    const { passwordHash, ...safeUser } = user;
    return safeUser as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const { passwordHash, ...safeUser } = user;
    return safeUser as User;
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'passwordHash'>>): Promise<User> {
    const processedUpdates: any = { ...updates };
    
    if (updates.profileId) {
      processedUpdates.profileId = new Types.ObjectId(updates.profileId);
    }
    
    const user = await this.userRepository.update(id, processedUpdates);
    const { passwordHash, ...safeUser } = user;
    return safeUser as User;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getAllUsers(params: PaginationParams): Promise<PaginatedResponse<User>> {
    const result = await this.userRepository.findAll(params);
    
    return {
      ...result,
      data: result.data?.map(user => {
        const { passwordHash, ...safeUser } = user;
        return safeUser as User;
      }) || [],
    };
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = await this.userRepository.updateRole(id, role);
    const { passwordHash, ...safeUser } = user;
    return safeUser as User;
  }

  async verifyUserEmail(id: string): Promise<User> {
    const user = await this.userRepository.verifyEmail(id);
    const { passwordHash, ...safeUser } = user;
    return safeUser as User;
  }

  async changeUserPassword(id: string, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const isOldPasswordValid = await this.verifyPassword(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await this.hashPassword(newPassword);
    const updatedUser = await this.userRepository.updatePassword(id, newPasswordHash);
    
    const { passwordHash, ...safeUser } = updatedUser;
    return safeUser as User;
  }

  async isEmailAvailable(email: string, excludeUserId?: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase();
    
    if (excludeUserId) {
      const existingUser = await this.userRepository.findByEmail(normalizedEmail);
      return !existingUser || existingUser.id === excludeUserId;
    }
    
    return !(await this.userRepository.existsByEmail(normalizedEmail));
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);
  }
}
