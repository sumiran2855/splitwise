import { NextRequest } from 'next/server';
import { ProfileModel } from '@/src/lib/models/Profile';
import { ProfileRepository } from '@/src/repositories/implementations/ProfileRepository';
import { ProfileService } from '@/src/services/server/ProfileService';
import { ProfileController } from '@/src/controllers/ProfileController';

export async function POST(request: NextRequest) {
  try {
    const profileRepository = new ProfileRepository(ProfileModel);
    const profileService = new ProfileService(profileRepository);
    const profileController = new ProfileController(profileService);
    
    return await profileController.ensureProfile(request);
  } catch (error) {
    console.error('Ensure profile error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      statusCode: 500,
    }), { status: 500 });
  }
}
