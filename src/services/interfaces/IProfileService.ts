export interface ProfileData {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  location?: string;
  preferences: {
    currency: string;
    timezone: string;
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  preferences?: Partial<{
    currency: string;
    timezone: string;
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    theme: 'light' | 'dark' | 'system';
  }>;
}

export interface ProfileResponse {
  success: boolean;
  data?: {
    id?: string;
    data: ProfileData;
    url?: string;
  };
  error?: string;
}

export interface IProfileService {
  getProfile(userId: string): Promise<ProfileResponse>;
  ensureProfile(userId: string, defaultData?: Partial<UpdateProfileData>): Promise<ProfileResponse>;
  updateProfile(userId: string, updateData: UpdateProfileData): Promise<ProfileResponse>;
  updateAvatar(userId: string, avatarUrl: string): Promise<ProfileResponse>;
}
