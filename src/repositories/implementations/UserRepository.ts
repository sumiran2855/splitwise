import { Model, Document, Types } from 'mongoose';
import { User, UserRole, PaginationParams, PaginatedResponse } from '../../types';
import { IUserRepository } from '../interfaces/IUserRepository';
import { database } from '../../config/database';

interface UserDocument extends Omit<User, 'id'>, Document {
  _id: Types.ObjectId;
}

export class UserRepository implements IUserRepository {
  private userModel: Model<UserDocument>;

  constructor(userModel: Model<UserDocument>) {
    this.userModel = userModel;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await database.ensureConnected();
    const user = new this.userModel(userData);
    const savedUser = await user.save();
    return this.mapDocumentToUser(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    await database.ensureConnected();
    const user = await this.userModel.findById(id);
    return user ? this.mapDocumentToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    await database.ensureConnected();
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    return user ? this.mapDocumentToUser(user) : null;
  }

  async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    await database.ensureConnected();
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return this.mapDocumentToUser(user);
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error('User not found');
    }
  }

  async findAll(params: PaginationParams): Promise<PaginatedResponse<User>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [users, total] = await Promise.all([
      this.userModel
        .find()
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.userModel.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: users.map(user => this.mapDocumentToUser(user)),
      statusCode: 200,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    return this.update(id, { role });
  }

  async verifyEmail(id: string): Promise<User> {
    return this.update(id, { isEmailVerified: true });
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return this.update(id, { passwordHash });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ _id: id });
    return count > 0;
  }

  private mapDocumentToUser(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      passwordHash: doc.passwordHash,
      avatar: doc.avatar,
      phoneNumber: doc.phoneNumber,
      isEmailVerified: doc.isEmailVerified,
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
