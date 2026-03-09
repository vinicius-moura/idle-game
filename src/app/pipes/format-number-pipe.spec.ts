import { FormatNumberPipe } from './format-number-pipe';

describe('FormatNumberPipe', () => {
  let pipe: FormatNumberPipe;

  beforeEach(() => {
    pipe = new FormatNumberPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "0" for 0 or negative numbers', () => {
    expect(pipe.transform(0)).toBe('0');
    expect(pipe.transform(-50)).toBe('0');
  });

  it('should return "MAX" for Infinity', () => {
    expect(pipe.transform(Infinity)).toBe('MAX');
  });

  it('should return the number as string for values less than 1000', () => {
    expect(pipe.transform(5)).toBe('5');
    expect(pipe.transform(999)).toBe('999');
  });

  it('should format thousands (K)', () => {
    expect(pipe.transform(1000)).toBe('1.00K');
    expect(pipe.transform(1500)).toBe('1.50K');
    expect(pipe.transform(999900)).toBe('999.90K');
  });

  it('should format millions (M)', () => {
    expect(pipe.transform(1000000)).toBe('1.00M');
    expect(pipe.transform(2500000)).toBe('2.50M');
  });

  it('should format billions (B) and trillions (T)', () => {
    expect(pipe.transform(1000000000)).toBe('1.00B');
    expect(pipe.transform(1000000000000)).toBe('1.00T');
  });

  it('should format very large numbers using the last suffixes (Oc)', () => {
    // 10^27 = 1 Octillion
    expect(pipe.transform(1e27)).toBe('1.00Oc');
  });

  it('should return exponential notation for numbers beyond the suffix list', () => {
    // 10^33 é maior que Octillion (10^27) na nossa lista
    const veryLargeNumber = 1e33;
    expect(pipe.transform(veryLargeNumber)).toBe(veryLargeNumber.toExponential(2));
  });
});