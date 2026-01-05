import { ExpenseParticipant } from '../../types';

export abstract class SplitStrategy {
  abstract calculateSplits(
    totalAmount: number,
    participants: Omit<ExpenseParticipant, 'paidAmount' | 'owesAmount'>[]
  ): ExpenseParticipant[];
}

export class EqualSplitStrategy extends SplitStrategy {
  calculateSplits(
    totalAmount: number,
    participants: Omit<ExpenseParticipant, 'paidAmount' | 'owesAmount'>[]
  ): ExpenseParticipant[] {
    if (participants.length === 0) {
      throw new Error('At least one participant is required');
    }

    const splitAmount = totalAmount / participants.length;
    
    return participants.map(participant => ({
      userId: participant.userId,
      amount: splitAmount,
      percentage: undefined,
      paidAmount: 0,
      owesAmount: splitAmount,
    }));
  }
}

export class ExactSplitStrategy extends SplitStrategy {
  calculateSplits(
    totalAmount: number,
    participants: Omit<ExpenseParticipant, 'paidAmount' | 'owesAmount'>[]
  ): ExpenseParticipant[] {
    const totalSpecified = participants.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    if (Math.abs(totalSpecified - totalAmount) > 0.01) {
      throw new Error('Sum of exact amounts must equal total expense amount');
    }

    return participants.map(participant => ({
      userId: participant.userId,
      amount: participant.amount,
      percentage: undefined,
      paidAmount: 0,
      owesAmount: participant.amount || 0,
    }));
  }
}

export class PercentageSplitStrategy extends SplitStrategy {
  calculateSplits(
    totalAmount: number,
    participants: Omit<ExpenseParticipant, 'paidAmount' | 'owesAmount'>[]
  ): ExpenseParticipant[] {
    const totalPercentage = participants.reduce((sum, p) => sum + (p.percentage || 0), 0);
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error('Sum of percentages must equal 100');
    }

    return participants.map(participant => {
      const percentage = participant.percentage || 0;
      const owesAmount = (totalAmount * percentage) / 100;
      
      return {
        userId: participant.userId,
        amount: undefined,
        percentage: percentage,
        paidAmount: 0,
        owesAmount: Math.round(owesAmount * 100) / 100,
      };
    });
  }
}
