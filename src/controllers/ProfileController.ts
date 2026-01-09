import { NextRequest, NextResponse } from 'next/server';
import { IProfileService } from '../services/interfaces/IProfileService';
import { CreateProfileData, UpdateProfileData } from '../domain/entities/Profile';
import { AppError } from '../utils/errors/AppError';
import { validateRequest } from '../utils/validation';
import {
  createProfileSchema,
  updateProfileSchema
} from '../validation/profileValidation';
import { ProfileModel } from '@/src/lib/models/Profile';
import mongoose from 'mongoose';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

  async uploadAvatar(request: NextRequest): Promise<NextResponse> {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File too large. Maximum size is 5MB' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const userId = formData.get('userId') as string;

      // Delete previous avatar if it exists
      if (userId) {
        await this.deletePreviousAvatar(userId);
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const filename = `avatar_${timestamp}_${randomString}.${fileExtension}`;

      const filepath = join(uploadsDir, filename);

      // Write file to disk
      await writeFile(filepath, buffer);

      // Return the URL that can be used to access the file
      const fileUrl = `/uploads/avatars/${filename}`;

      return NextResponse.json({
        success: true,
        data: {
          url: fileUrl,
          filename: filename,
          size: file.size,
          type: file.type
        }
      });
    } catch (error) {
      console.error('File upload error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      );
    }
  }

  async deletePreviousAvatar(userId: string): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SplitEase');
      }

      const profile = await ProfileModel.findOne({ userId });
      if (profile && profile.avatar) {
        const isDefaultAvatar = profile.avatar.includes('default') ||
          profile.avatar.includes('placeholder') ||
          !profile.avatar.startsWith('/uploads/avatars/');

        if (isDefaultAvatar) {
          return;
        }

        const oldAvatarPath = join(process.cwd(), 'public', profile.avatar);
        if (existsSync(oldAvatarPath)) {
          await unlink(oldAvatarPath);
        }
      }
    } catch (error) {
      console.error('Error deleting previous avatar:', error);
    }
  }
}
