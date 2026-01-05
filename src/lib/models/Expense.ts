import mongoose, { Schema, Model } from 'mongoose';
import { ExpenseStatus, SplitType } from '../../types';

interface ExpenseParticipantDocument extends mongoose.Document {
  userId: string;
  amount?: number;
  percentage?: number;
  paidAmount: number;
  owesAmount: number;
}

interface ExpenseDocument extends mongoose.Document {
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  groupId?: string;
  splitType: SplitType;
  status: ExpenseStatus;
  participants: ExpenseParticipantDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const expenseParticipantSchema = new Schema<ExpenseParticipantDocument>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Number,
    min: 0,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  owesAmount: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const expenseSchema = new Schema<ExpenseDocument>({
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    validate: {
      validator: function(v: string) {
        return /^[A-Z]{3}$/.test(v);
      },
      message: 'Currency must be a 3-letter ISO code',
    },
  },
  paidBy: {
    type: String,
    required: true,
    ref: 'User',
  },
  groupId: {
    type: String,
    ref: 'Group',
  },
  splitType: {
    type: String,
    enum: Object.values(SplitType),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ExpenseStatus),
    default: ExpenseStatus.PENDING,
  },
  participants: [expenseParticipantSchema],
}, {
  timestamps: true,
});

expenseSchema.index({ paidBy: 1 });
expenseSchema.index({ groupId: 1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ createdAt: -1 });
expenseSchema.index({ 'participants.userId': 1 });

expenseSchema.pre('save', function() {
  if (this.isModified('participants')) {
    const totalOwed = this.participants.reduce((sum: number, p: any) => sum + p.owesAmount, 0);
    if (Math.abs(totalOwed - this.amount) > 0.01) {
      throw new Error('Total owed amount must equal expense amount');
    }
  }
});

export const ExpenseModel: Model<ExpenseDocument> = mongoose.models.Expense || mongoose.model<ExpenseDocument>('Expense', expenseSchema);
