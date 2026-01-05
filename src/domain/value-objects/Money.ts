export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = 'USD') {
    this.validateAmount(amount);
    this.validateCurrency(currency);
    this.amount = amount;
    this.currency = currency.toUpperCase();
  }

  private validateAmount(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Amount must be a valid number');
    }
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (amount > Number.MAX_SAFE_INTEGER) {
      throw new Error('Amount exceeds maximum safe integer');
    }
  }

  private validateCurrency(currency: string): void {
    if (typeof currency !== 'string' || currency.trim().length === 0) {
      throw new Error('Currency must be a non-empty string');
    }
    if (currency.length !== 3) {
      throw new Error('Currency must be a 3-letter ISO 4217 code');
    }
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public add(other: Money): Money {
    if (this.currency !== other.getCurrency()) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.getAmount(), this.currency);
  }

  public subtract(other: Money): Money {
    if (this.currency !== other.getCurrency()) {
      throw new Error('Cannot subtract money with different currencies');
    }
    const result = this.amount - other.getAmount();
    if (result < 0) {
      throw new Error('Resulting amount cannot be negative');
    }
    return new Money(result, this.currency);
  }

  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative');
    }
    return new Money(this.amount * factor, this.currency);
  }

  public divide(divisor: number): Money {
    if (divisor <= 0) {
      throw new Error('Divisor must be positive');
    }
    return new Money(this.amount / divisor, this.currency);
  }

  public equals(other: Money): boolean {
    return this.amount === other.getAmount() && this.currency === other.getCurrency();
  }

  public isGreaterThan(other: Money): boolean {
    if (this.currency !== other.getCurrency()) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount > other.getAmount();
  }

  public isLessThan(other: Money): boolean {
    if (this.currency !== other.getCurrency()) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount < other.getAmount();
  }

  public toFormattedString(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }

  public toJSON(): { amount: number; currency: string } {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }

  public static fromJSON(data: { amount: number; currency: string }): Money {
    return new Money(data.amount, data.currency);
  }
}
