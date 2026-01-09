import { NextRequest, NextResponse } from 'next/server';

import { ProfileController } from '@/src/controllers/ProfileController';
import { ProfileService } from '@/src/services/server/ProfileService';
import { ProfileRepository } from '@/src/repositories/implementations/ProfileRepository';
import { ProfileModel } from '@/src/lib/models/Profile';

export async function POST(request: NextRequest) {
  try {
    const profileRepository = new ProfileRepository(ProfileModel);
    const profileService = new ProfileService(profileRepository);
    const profileController = new ProfileController(profileService);
    
    return await profileController.uploadAvatar(request);

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
