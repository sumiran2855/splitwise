import { useState, useEffect } from 'react';
import { ProfileData, UpdateProfileData } from '../services/interfaces/IProfileService';
import { ClientProfileService } from '../services/client/ClientProfileService';
import { ApiClient } from '../api/ApiClient';
import { ValidationService } from '../validation/ValidationService';
import { toast } from 'sonner';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiClient = ApiClient.getInstance();
  const validationService = ValidationService.getInstance();
  const profileService = new ClientProfileService(apiClient, validationService);
  const { user: currentUser, loading: userLoading } = useCurrentUser();

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

  const handleAvatarUpload = async (file: File): Promise<boolean> => {
    if (!userId || userId === 'skip') {
      toast.error('Cannot upload avatar: User not found');
      return false;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB');
      return false;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      return false;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await profileService.uploadAvatar(userId, formData);

      if (!uploadResponse?.data) {
        toast.error('Failed to upload avatar');
        return false;
      }

      const avatarUrl = (uploadResponse?.data as any)?.data?.url;

      const tempAvatarUrl = URL.createObjectURL(file);
      setTempAvatar(tempAvatarUrl);

      const success = await updateAvatar(avatarUrl!);
      if (success) {
        toast.success('Avatar uploaded successfully');
        URL.revokeObjectURL(tempAvatarUrl);
        setTempAvatar(null);
        await fetchProfile();
      } else {
        setTempAvatar(null);
        URL.revokeObjectURL(tempAvatarUrl);
      }
      return true;
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar');
      setTempAvatar(null);
      return false;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isSubmitting || !profile) return;

    setIsSubmitting(true);
    const success = await updateProfile({
      fullName: profile.fullName,
      phone: profile.phone || undefined,
      location: profile.location || undefined,
    });
    setIsSubmitting(false);
  };

  const handleAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleAvatarUpload(file);
      }
    };
    input.click();
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
    isSubmitting,
    isUploadingAvatar,
    tempAvatar,
    refetch: fetchProfile,
    updateProfile,
    updateAvatar,
    handleSave,
    handleAvatarClick,
    handleAvatarUpload,
  };
}
