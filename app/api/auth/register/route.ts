import { NextRequest } from 'next/server';
import { UserModel } from '../../../../src/lib/models/User';
import { ProfileModel } from '../../../../src/lib/models/Profile';
import { UserRepository } from '../../../../src/repositories/implementations/UserRepository';
import { ProfileRepository } from '../../../../src/repositories/implementations/ProfileRepository';
import { UserService } from '../../../../src/services/implementations/UserService';
import { ServerProfileService } from '../../../../src/services/implementations/ServerProfileService';
import { UserController } from '../../../../src/controllers/UserController';

export async function POST(request: NextRequest) {
  try {
    const userRepository = new UserRepository(UserModel);
    const profileRepository = new ProfileRepository(ProfileModel);
    const userService = new UserService(userRepository);
    const profileService = new ServerProfileService(profileRepository);
    const userController = new UserController(userService, profileService);
    
    return await userController.register(request);
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      statusCode: 500,
    }), { status: 500 });
  }
}
