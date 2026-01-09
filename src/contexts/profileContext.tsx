'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ProfileData } from '../services/interfaces/IProfileService';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useProfile } from '../hooks/useProfile';

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isUploadingAvatar: boolean;
  tempAvatar: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: any) => Promise<boolean>;
  updateAvatar: (avatarUrl: string) => Promise<boolean>;
  handleSave: (e: React.FormEvent) => Promise<void>;
  handleAvatarClick: () => void;
  handleAvatarUpload: (file: File) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { user: currentUser } = useCurrentUser();
  
  const profileHook = useProfile(
    currentUser?.id ? currentUser.id : 'skip'
  );

  return (
    <ProfileContext.Provider value={profileHook}>
      {children}
    </ProfileContext.Provider>
  );
}
