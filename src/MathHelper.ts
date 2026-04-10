/**
 * A utility class providing advanced mathematical operations.
 *
 * @example
 * const math = new MathHelper();
 * console.log(math.factorial(5)); // 120
 */
export class MathHelper {
  /**
   * Computes the factorial of a non-negative integer.
   *
   * @param {number} n - A non-negative integer.
   * @returns {number} The factorial of n (n!).
   * @throws {Error} If n is negative or not an integer.
   *
   * @example
   * const math = new MathHelper();
   * console.log(math.factorial(5)); // 120
   * console.log(math.factorial(0)); // 1
   */
  factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) throw new Error('Input must be a non-negative integer');
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  }

  /**
   * Computes the nth Fibonacci number using memoization.
   *
   * @param {number} n - The position in the Fibonacci sequence (0-indexed).
   * @returns {number} The nth Fibonacci number.
   * @throws {Error} If n is negative.
   *
   * @example
   * const math = new MathHelper();
   * console.log(math.fibonacci(10)); // 55
   * console.log(math.fibonacci(0));  // 0
   */
  fibonacci(n: number): number {
    if (n < 0) throw new Error('Input must be a non-negative integer');
    const memo = new Map<number, number>();
    const fib = (k: number): number => {
      if (k <= 1) return k;
      if (memo.has(k)) return memo.get(k)!;
      const result = fib(k - 1) + fib(k - 2);
      memo.set(k, result);
      return result;
    };
    return fib(n);
  }

  /**
   * Returns the Greatest Common Divisor (GCD) of two integers using Euclid's algorithm.
   *
   * @param {number} a - The first integer.
   * @param {number} b - The second integer.
   * @returns {number} The GCD of a and b.
   *
   * @example
   * const math = new MathHelper();
   * console.log(math.gcd(48, 18)); // 6
   */
  gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
  }

  /**
   * Returns the Least Common Multiple (LCM) of two integers.
   *
   * @param {number} a - The first integer.
   * @param {number} b - The second integer.
   * @returns {number} The LCM of a and b.
   *
   * @example
   * const math = new MathHelper();
   * console.log(math.lcm(4, 6)); // 12
   */
  lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  }

  /**
   * Determines whether a given number is prime.
   *
   * @param {number} n - The number to test.
   * @returns {boolean} True if n is prime.
   *
   * @example
   * const math = new MathHelper();
   * console.log(math.isPrime(7));  // true
   * console.log(math.isPrime(10)); // false
   */
  isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  /**
   * Clamps a number to the inclusive range [min, max].
   *
   * @param {number} value - The value to clamp.
   * @param {number} min - The minimum bound.
   * @param {number} max - The maximum bound.
   * @returns {number} The clamped value.
   * @throws {Error} If min > max.
   *
   * @example
   * const math = new MathHelper();
   * console.log(math.clamp(15, 0, 10)); // 10
   * console.log(math.clamp(-5, 0, 10)); // 0
   * console.log(math.clamp(5, 0, 10));  // 5
   */
  clamp(value: number, min: number, max: number): number {
    if (min > max) throw new Error('min must be <= max');
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Rounds a number to a given number of decimal places.
   *
   * @param {number} value - The value to round.
   * @param {number} decimals - Number of decimal places (0 or more).
   * @returns {number} The rounded value.
   *
   * @example
   * const math = new MathHelper();
   * console.log(math.roundTo(3.14159, 2)); // 3.14
   */
  roundTo(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
