import { Profile, CreateProfileData, UpdateProfileData } from '@/src/domain/entities/Profile';

export interface IProfileRepository {
  create(profileData: CreateProfileData): Promise<Profile>;
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile | null>;
  update(id: string, updateData: UpdateProfileData): Promise<Profile | null>;
  delete(id: string): Promise<boolean>;
  updateAvatar(id: string, avatarUrl: string): Promise<Profile | null>;
}
