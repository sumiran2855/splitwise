import { IProfileService, ProfileData, UpdateProfileData, ProfileResponse } from '../interfaces/IProfileService';
import { ApiClient } from '../../api/ApiClient';
import { ValidationService, ValidationType } from '../../validation/ValidationService';
import { API_ROUTES } from '../../api/routes';

export class ClientProfileService implements IProfileService {
  constructor(
    private apiClient: ApiClient,
    private validationService: ValidationService
  ) {}

  async getProfile(userId: string): Promise<ProfileResponse> {
    // Validate input
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    try {
      const response = await this.apiClient.get<ProfileResponse>(`${API_ROUTES.PROFILE.GET}?userId=${userId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile'
      };
    }
  }

  async ensureProfile(userId: string, defaultData?: Partial<UpdateProfileData>): Promise<ProfileResponse> {
    // Validate input
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }
    try {
      const response = await this.apiClient.post<ProfileResponse>(
        `${API_ROUTES.PROFILE.ENSURE}?userId=${encodeURIComponent(userId)}`,
        {
          defaultData: {
            userId,
            ...defaultData,
          }
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to ensure profile'
      };
    }
  }

  async updateProfile(userId: string, updateData: UpdateProfileData): Promise<ProfileResponse> {
    // Validate input
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const validations: Array<{ type: ValidationType; value: string }> = [];
    
    if (updateData.fullName) {
      validations.push({ type: ValidationType.NAME, value: updateData.fullName });
    }

    if (validations.length > 0) {
      const validation = this.validationService.validateMultiple(validations);
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }
    }

    try {
      const response = await this.apiClient.put<ProfileResponse>(`${API_ROUTES.PROFILE.UPDATE}?userId=${userId}`, updateData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<ProfileResponse> {
    // Validate input
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    if (!avatarUrl) {
      return {
        success: false,
        error: 'Avatar URL is required'
      };
    }

    try {
      const response = await this.apiClient.put<ProfileResponse>(`${API_ROUTES.PROFILE.UPDATE_AVATAR}?userId=${userId}`, {
        avatarUrl
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update avatar'
      };
    }
  }
}
