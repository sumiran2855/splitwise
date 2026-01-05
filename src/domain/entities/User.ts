import { User, UserRole } from '../../types';

export class UserEntity {
  private readonly id: string;
  private email: string;
  private name: string;
  private passwordHash: string;
  private avatar?: string;
  private phoneNumber?: string;
  private isEmailVerified: boolean;
  private role: UserRole;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: Omit<User, 'id'> & { id?: string }) {
    this.id = data.id || this.generateId();
    this.email = data.email;
    this.name = data.name;
    this.passwordHash = data.passwordHash;
    this.avatar = data.avatar;
    this.phoneNumber = data.phoneNumber;
    this.isEmailVerified = data.isEmailVerified;
    this.role = data.role;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getAvatar(): string | undefined {
    return this.avatar;
  }

  public getPhoneNumber(): string | undefined {
    return this.phoneNumber;
  }

  public isEmailVerifiedStatus(): boolean {
    return this.isEmailVerified;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  public updateAvatar(avatar: string): void {
    this.avatar = avatar;
    this.updatedAt = new Date();
  }

  public updatePhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
    this.updatedAt = new Date();
  }

  public verifyEmail(): void {
    this.isEmailVerified = true;
    this.updatedAt = new Date();
  }

  public updatePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
    this.updatedAt = new Date();
  }

  public updateRole(role: UserRole): void {
    this.role = role;
    this.updatedAt = new Date();
  }

  public toJSON(): User {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      passwordHash: this.passwordHash,
      avatar: this.avatar,
      phoneNumber: this.phoneNumber,
      isEmailVerified: this.isEmailVerified,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public toSafeJSON(): Omit<User, 'passwordHash'> {
    const { passwordHash, ...safeUser } = this.toJSON();
    return safeUser;
  }
}
