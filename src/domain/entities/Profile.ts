export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  location?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  currency: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface CreateProfileData {
  userId: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  location?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  preferences?: Partial<UserPreferences>;
}
