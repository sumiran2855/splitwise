import { ProfileModel, ProfileDocument } from '@/src/lib/models/Profile';
import { Profile, CreateProfileData, UpdateProfileData } from '@/src/domain/entities/Profile';
import { IProfileRepository } from '@/src/repositories/interfaces/IProfileRepository';
import { Model } from 'mongoose';

export class ProfileRepository implements IProfileRepository {
  constructor(private profileModel: Model<ProfileDocument>) {}

  private mapDocumentToEntity(document: ProfileDocument): Profile {
    return {
      id: document._id.toString(),
      userId: document.userId,
      fullName: document.fullName,
      phone: document.phone,
      avatar: document.avatar,
      location: document.location,
      preferences: {
        currency: document.preferences.currency,
        timezone: document.preferences.timezone,
        language: document.preferences.language,
        emailNotifications: document.preferences.emailNotifications,
        pushNotifications: document.preferences.pushNotifications,
        weeklyDigest: document.preferences.weeklyDigest,
        theme: document.preferences.theme,
      },
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async create(profileData: CreateProfileData): Promise<Profile> {
    const document = new this.profileModel({
      userId: profileData.userId,
      fullName: profileData.fullName,
      phone: profileData.phone,
      avatar: profileData.avatar,
      location: profileData.location,
      preferences: {
        currency: 'USD',
        timezone: 'UTC',
        language: 'en',
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
        theme: 'system',
        ...profileData.preferences,
      },
    });

    const savedDocument = await document.save();
    return this.mapDocumentToEntity(savedDocument);
  }

  async findById(id: string): Promise<Profile | null> {
    const document = await this.profileModel.findById(id);
    return document ? this.mapDocumentToEntity(document) : null;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const document = await this.profileModel.findOne({ userId });
    return document ? this.mapDocumentToEntity(document) : null;
  }

  async update(id: string, updateData: UpdateProfileData): Promise<Profile | null> {
    const updateDoc: any = {
      ...updateData,
      updatedAt: new Date(),
    };

    if (updateData.preferences) {
      updateDoc.preferences = { $set: updateData.preferences };
    }

    const document = await this.profileModel.findByIdAndUpdate(
      id,
      updateDoc,
      { new: true, runValidators: true }
    );

    return document ? this.mapDocumentToEntity(document) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.profileModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<Profile | null> {
    const document = await this.profileModel.findByIdAndUpdate(
      id,
      { avatar: avatarUrl, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return document ? this.mapDocumentToEntity(document) : null;
  }
}
