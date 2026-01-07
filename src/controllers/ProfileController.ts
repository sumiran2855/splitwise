import { NextRequest, NextResponse } from 'next/server';
import { IProfileService } from '../services/interfaces/IProfileService';
import { CreateProfileData, UpdateProfileData } from '../domain/entities/Profile';
import { AppError } from '../utils/errors/AppError';
import { validateRequest } from '../utils/validation';
import {
  createProfileSchema,
  updateProfileSchema
} from '../validation/profileValidation';

export class ProfileController {
  constructor(private profileService: IProfileService) { }

  async createProfile(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const validatedData = validateRequest(createProfileSchema, body);

      const profileData: CreateProfileData = {
        userId: validatedData.userId,
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        avatar: validatedData.avatar,
        location: validatedData.location,
        preferences: validatedData.preferences,
      };

      const response = await this.profileService.ensureProfile(validatedData.userId, profileData);
      if (!response.success) {
        return NextResponse.json(
          { success: false, error: response.error },
          { status: 400 }
        );
      }
      const profile = response.data;

      return NextResponse.json({
        success: true,
        data: profile,
        message: 'Profile created successfully',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  async getProfile(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');
      console.debug("🚀 ~ ProfileController ~ getProfile ~ userId:", userId)

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      const response = await this.profileService.getProfile(userId);
      if (!response.success) {
        return NextResponse.json(
          { success: false, error: response.error },
          { status: 404 }
        );
      }
      const profile = response.data;

      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  async updateProfile(request: NextRequest, body?: any): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      const requestBody = body || await request.json();
      const validatedData = validateRequest(updateProfileSchema, requestBody);

      const updateData: UpdateProfileData = {
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        avatar: validatedData.avatar,
        location: validatedData.location,
        preferences: validatedData.preferences,
      };

      const profile = await this.profileService.updateProfile(userId, updateData);

      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: profile,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  async updateAvatar(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      const body = await request.json();
      const { avatarUrl } = body;

      if (!avatarUrl) {
        return NextResponse.json(
          { success: false, error: 'Avatar URL is required' },
          { status: 400 }
        );
      }

      const response = await this.profileService.updateAvatar(userId, avatarUrl);
      if (!response.success) {
        return NextResponse.json(
          { success: false, error: response.error },
          { status: 404 }
        );
      }
      const profile = response.data;

      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: profile,
        message: 'Avatar updated successfully',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  async ensureProfile(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const queryUserId = searchParams.get('userId');
      const body = await request.json();
      const defaultData = body.defaultData || {};
      const bodyUserId = defaultData?.userId;

      const userId = queryUserId || bodyUserId;

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      const profile = await this.profileService.ensureProfile(userId, defaultData);

      return NextResponse.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
