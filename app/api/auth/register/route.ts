import { NextRequest } from 'next/server';
import { UserModel } from '../../../../src/lib/models/User';
import { UserRepository } from '../../../../src/repositories/implementations/UserRepository';
import { UserService } from '../../../../src/services/implementations/UserService';
import { UserController } from '../../../../src/controllers/UserController';

export async function POST(request: NextRequest) {
  try {
    const userRepository = new UserRepository(UserModel);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    
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
