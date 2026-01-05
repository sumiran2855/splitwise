import { Expense, ExpenseStatus, SplitType, ExpenseParticipant } from '../../types';

export class ExpenseEntity {
  private readonly id: string;
  private description: string;
  private amount: number;
  private currency: string;
  private paidBy: string;
  private groupId?: string;
  private splitType: SplitType;
  private status: ExpenseStatus;
  private participants: ExpenseParticipant[];
  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: Omit<Expense, 'id'> & { id?: string }) {
    this.id = data.id || this.generateId();
    this.description = data.description;
    this.amount = data.amount;
    this.currency = data.currency;
    this.paidBy = data.paidBy;
    this.groupId = data.groupId;
    this.splitType = data.splitType;
    this.status = data.status;
    this.participants = data.participants;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public getId(): string {
    return this.id;
  }

  public getDescription(): string {
    return this.description;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getPaidBy(): string {
    return this.paidBy;
  }

  public getGroupId(): string | undefined {
    return this.groupId;
  }

  public getSplitType(): SplitType {
    return this.splitType;
  }

  public getStatus(): ExpenseStatus {
    return this.status;
  }

  public getParticipants(): ExpenseParticipant[] {
    return this.participants;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  public updateStatus(status: ExpenseStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  public updateParticipantPayment(userId: string, paidAmount: number): void {
    const participant = this.participants.find(p => p.userId === userId);
    if (participant) {
      participant.paidAmount = paidAmount;
      this.updateStatusBasedOnPayments();
      this.updatedAt = new Date();
    }
  }

  private updateStatusBasedOnPayments(): void {
    const totalPaid = this.participants.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalOwed = this.participants.reduce((sum, p) => sum + p.owesAmount, 0);

    if (totalPaid === 0) {
      this.status = ExpenseStatus.PENDING;
    } else if (totalPaid >= totalOwed) {
      this.status = ExpenseStatus.SETTLED;
    } else {
      this.status = ExpenseStatus.PARTIALLY_SETTLED;
    }
  }

  public toJSON(): Expense {
    return {
      id: this.id,
      description: this.description,
      amount: this.amount,
      currency: this.currency,
      paidBy: this.paidBy,
      groupId: this.groupId,
      splitType: this.splitType,
      status: this.status,
      participants: this.participants,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
