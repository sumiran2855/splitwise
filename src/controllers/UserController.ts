import { NextRequest, NextResponse } from 'next/server';
import { CreateUserDto, LoginDto, UserRole, ApiResponse } from '@/src/types/index';
import { IUserService } from '@/src/services/interfaces/IUserService';

export class UserController {
  constructor(private userService: IUserService) {}

  async register(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
      const body: CreateUserDto = await request.json();
      
      const user = await this.userService.createUser(body);
      
      return NextResponse.json({
        success: true,
        data: user,
        message: 'User registered successfully',
        statusCode: 201,
      }, { status: 201 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async login(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
      const body: LoginDto = await request.json();
      
      const result = await this.userService.authenticateUser(body);
      
      return NextResponse.json({
        success: true,
        data: result,
        message: 'Login successful',
        statusCode: 200,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getProfile(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
      const userId = this.getUserIdFromRequest(request);
      
      if (!userId) {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized',
          statusCode: 401,
        }, { status: 401 });
      }

      const user = await this.userService.getUserById(userId);
      
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
          statusCode: 404,
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: user,
        statusCode: 200,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateProfile(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
      const userId = this.getUserIdFromRequest(request);
      
      if (!userId) {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized',
          statusCode: 401,
        }, { status: 401 });
      }

      const updates = await request.json();
      
      const user = await this.userService.updateUser(userId, updates);
      
      return NextResponse.json({
        success: true,
        data: user,
        message: 'Profile updated successfully',
        statusCode: 200,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAllUsers(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';

      const result = await this.userService.getAllUsers({
        page,
        limit,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Users retrieved successfully',
        statusCode: 200,
        pagination: result.pagination,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateUserRole(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
      const userId = this.getUserIdFromRequest(request);
      const { targetUserId, role } = await request.json();

      if (!userId) {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized',
          statusCode: 401,
        }, { status: 401 });
      }

      const user = await this.userService.updateUserRole(targetUserId, role as UserRole);
      
      return NextResponse.json({
        success: true,
        data: user,
        message: 'User role updated successfully',
        statusCode: 200,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private getUserIdFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      return decoded.id;
    } catch {
      return null;
    }
  }

  private handleError(error: any): NextResponse<ApiResponse> {
    console.error('Controller error:', error);
    
    if (error.message === 'User with this email already exists') {
      return NextResponse.json({
        success: false,
        error: 'Email already registered',
        statusCode: 409,
      }, { status: 409 });
    }

    if (error.message === 'Invalid credentials') {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password',
        statusCode: 401,
      }, { status: 401 });
    }

    if (error.message === 'User not found') {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        statusCode: 404,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      statusCode: 500,
    }, { status: 500 });
  }
}
