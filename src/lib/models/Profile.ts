import mongoose, { Schema, Document } from 'mongoose';

export interface ProfileDocument extends Document {
  userId: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  location?: string;
  preferences: {
    currency: string;
    timezone: string;
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  avatar: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR']
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja']
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    weeklyDigest: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'system',
      enum: ['light', 'dark', 'system']
    }
  }
}, {
  timestamps: true,
  collection: 'profiles'
});

// Index for efficient queries
ProfileSchema.index({ userId: 1 });

export const ProfileModel = mongoose.models.Profile || mongoose.model<ProfileDocument>('Profile', ProfileSchema);
