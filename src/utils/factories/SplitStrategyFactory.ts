import { SplitType } from '../../types';
import { 
  SplitStrategy, 
  EqualSplitStrategy, 
  ExactSplitStrategy, 
  PercentageSplitStrategy 
} from '../strategies/SplitStrategy';

export class SplitStrategyFactory {
  private static strategies: Map<SplitType, () => SplitStrategy> = new Map([
    [SplitType.EQUAL, () => new EqualSplitStrategy()],
    [SplitType.EXACT, () => new ExactSplitStrategy()],
    [SplitType.PERCENTAGE, () => new PercentageSplitStrategy()],
  ]);

  public static createStrategy(splitType: SplitType): SplitStrategy {
    const strategyFactory = this.strategies.get(splitType);
    
    if (!strategyFactory) {
      throw new Error(`Unsupported split type: ${splitType}`);
    }
    
    return strategyFactory();
  }

  public static getSupportedTypes(): SplitType[] {
    return Array.from(this.strategies.keys());
  }

  public static isSupported(splitType: SplitType): boolean {
    return this.strategies.has(splitType);
  }
}
