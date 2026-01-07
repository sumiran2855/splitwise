import { NextRequest } from 'next/server';
import { ProfileModel } from '@/src/lib/models/Profile';
import { ProfileRepository } from '@/src/repositories/implementations/ProfileRepository';
import { ServerProfileService } from '@/src/services/implementations/ServerProfileService';
import { ProfileController } from '@/src/controllers/ProfileController';

export async function GET(request: NextRequest) {
  try {
    const profileRepository = new ProfileRepository(ProfileModel);
    const profileService = new ServerProfileService(profileRepository);
    const profileController = new ProfileController(profileService);
    
    return await profileController.getProfile(request);
  } catch (error) {
    console.error('Get profile error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      statusCode: 500,
    }), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profileRepository = new ProfileRepository(ProfileModel);
    const profileService = new ServerProfileService(profileRepository);
    const profileController = new ProfileController(profileService);
    
    return await profileController.createProfile(request);
  } catch (error) {
    console.error('Create profile error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      statusCode: 500,
    }), { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const profileRepository = new ProfileRepository(ProfileModel);
    const profileService = new ServerProfileService(profileRepository);
    const profileController = new ProfileController(profileService);
    
    return await profileController.updateProfile(request, body);
  } catch (error) {
    console.error('Update profile error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      statusCode: 500,
    }), { status: 500 });
  }
}
