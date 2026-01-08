import { useState, useEffect } from 'react';
import { ProfileData, UpdateProfileData } from '../services/interfaces/IProfileService';
import { ClientProfileService } from '../services/client/ClientProfileService';
import { ApiClient } from '../api/ApiClient';
import { ValidationService } from '../validation/ValidationService';
import { toast } from 'sonner';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiClient = ApiClient.getInstance();
  const validationService = ValidationService.getInstance();
  const profileService = new ClientProfileService(apiClient, validationService);

  const fetchProfile = async () => {
    // Skip API call if userId is invalid
    if (!userId || userId === 'skip') {
      setLoading(false);
      return;
    }
    

    try {
      setLoading(true);
      setError(null);
      const response = await profileService.ensureProfile(userId);
      if (response.success && response.data) {
        setProfile(response.data.data);
      } else {
        setError(response.error || 'Failed to fetch profile');
        toast.error(response.error || 'Failed to fetch profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData: UpdateProfileData): Promise<boolean> => {
    // Prevent update if userId is invalid
    if (!userId || userId === 'skip') {
      toast.error('Cannot update profile: User not found');
      return false;
    }

    try {
      const response = await profileService.updateProfile(userId, updateData);
      if (response.success && response.data) {
        setProfile(response.data.data);
        toast.success('Profile updated successfully');
        return true;
      } else {
        const errorMessage = response.error || 'Failed to update profile';
        toast.error(errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(errorMessage);
      return false;
    }
  };

  const updateAvatar = async (avatarUrl: string): Promise<boolean> => {
    // Prevent update if userId is invalid
    if (!userId || userId === 'skip') {
      toast.error('Cannot update avatar: User not found');
      return false;
    }

    try {
      const response = await profileService.updateAvatar(userId, avatarUrl);
      if (response.success && response.data) {
        setProfile(response.data.data);
        toast.success('Avatar updated successfully');
        return true;
      } else {
        const errorMessage = response.error || 'Failed to update avatar';
        toast.error(errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update avatar';
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    if (userId && userId !== 'skip') {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    updateAvatar,
  };
}
