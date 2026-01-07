import { Profile, CreateProfileData, UpdateProfileData } from '../../domain/entities/Profile';
import { IProfileRepository } from '../../repositories/interfaces/IProfileRepository';
import { IProfileService } from '../interfaces/IProfileService';
import { AppError } from '../../utils/errors/AppError';

export class ServerProfileService implements IProfileService {
  constructor(private profileRepository: IProfileRepository) {}

  async getProfile(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const profile = await this.profileRepository.findByUserId(userId);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile'
      };
    }
  }

  async ensureProfile(
    userId: string, 
    defaultData?: Partial<UpdateProfileData>
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      let profile = await this.profileRepository.findByUserId(userId);
      
      if (!profile) {
        const createData: CreateProfileData = {
          userId,
          fullName: defaultData?.fullName || 'User',
          phone: defaultData?.phone,
          avatar: defaultData?.avatar,
          location: defaultData?.location,
          preferences: defaultData?.preferences,
        };
        
        profile = await this.profileRepository.create(createData);
      }
      
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to ensure profile'
      };
    }
  }

  async updateProfile(userId: string, updateData: UpdateProfileData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {  
      let profile = await this.profileRepository.findByUserId(userId);

      if (!profile) {
        // Create profile if it doesn't exist
        const createData: CreateProfileData = {
          userId,
          fullName: updateData.fullName || 'User',
          phone: updateData.phone,
          avatar: updateData.avatar,
          location: updateData.location,
          preferences: updateData.preferences,
        };
        
        profile = await this.profileRepository.create(createData);        
        const updatedProfile = await this.profileRepository.update(profile.id, updateData);
        
        return {
          success: true,
          data: updatedProfile
        };
      }

      const updatedProfile = await this.profileRepository.update(profile.id, updateData);
      
      return {
        success: true,
        data: updatedProfile
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const profile = await this.profileRepository.findByUserId(userId);
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      const updatedProfile = await this.profileRepository.updateAvatar(profile.id, avatarUrl);
      
      return {
        success: true,
        data: updatedProfile
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update avatar'
      };
    }
  }
}
