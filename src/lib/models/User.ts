import mongoose, { Schema, Model } from 'mongoose';
import { UserRole } from '../../types';

interface UserDocument extends mongoose.Document {
  email: string;
  passwordHash: string;
  name: string;
  avatar?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 60,
    maxlength: 60,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  avatar: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Avatar must be a valid image URL',
    },
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: 'Phone number must be a valid international phone number',
    },
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.passwordHash;
      return ret;
    },
  },
  toObject: {
    transform: function(doc: any, ret: any) {
      delete ret.passwordHash;
      return ret;
    },
  },
});

userSchema.index({ name: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', function() {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
});

export const UserModel: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
