/**
 * A fixed-size circular (ring) buffer.
 * When full, writing overwrites the oldest entry.
 *
 * @template T The element type.
 *
 * @example
 * const buf = new CircularBuffer<number>(3);
 * buf.write(1); buf.write(2); buf.write(3);
 * buf.write(4); // overwrites 1
 * console.log(buf.read()); // 2
 */
export class CircularBuffer<T> {
  private buffer: Array<T | undefined>;
  private head: number = 0;
  private tail: number = 0;
  private count: number = 0;
  private readonly capacity: number;

  /**
   * Creates a new CircularBuffer with the given capacity.
   *
   * @param {number} capacity - Maximum number of elements before overwriting.
   * @throws {Error} If capacity is not a positive integer.
   *
   * @example
   * const buf = new CircularBuffer<string>(5);
   */
  constructor(capacity: number) {
    if (capacity <= 0 || !Number.isInteger(capacity)) throw new Error('Capacity must be a positive integer');
    this.capacity = capacity;
    this.buffer = new Array(capacity).fill(undefined);
  }

  /**
   * Writes a value into the buffer.
   * If the buffer is full, the oldest value is overwritten.
   *
   * @param {T} value - The value to write.
   * @returns {void}
   *
   * @example
   * const buf = new CircularBuffer<number>(2);
   * buf.write(1);
   * buf.write(2);
   * buf.write(3); // overwrites 1
   */
  write(value: T): void {
    this.buffer[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    if (this.count < this.capacity) {
      this.count++;
    } else {
      this.head = (this.head + 1) % this.capacity;
    }
  }

  /**
   * Reads and removes the oldest value from the buffer.
   *
   * @returns {T} The oldest value.
   * @throws {Error} If the buffer is empty.
   *
   * @example
   * const buf = new CircularBuffer<string>(3);
   * buf.write('a');
   * buf.write('b');
   * console.log(buf.read()); // 'a'
   */
  read(): T {
    if (this.isEmpty()) throw new Error('Buffer is empty');
    const value = this.buffer[this.head] as T;
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return value;
  }

  /**
   * Returns the oldest value without removing it.
   *
   * @returns {T} The oldest value.
   * @throws {Error} If the buffer is empty.
   *
   * @example
   * const buf = new CircularBuffer<number>(3);
   * buf.write(10);
   * console.log(buf.peek()); // 10
   * console.log(buf.size()); // still 1
   */
  peek(): T {
    if (this.isEmpty()) throw new Error('Buffer is empty');
    return this.buffer[this.head] as T;
  }

  /**
   * Returns true if the buffer contains no elements.
   *
   * @returns {boolean} True if empty.
   *
   * @example
   * const buf = new CircularBuffer<number>(5);
   * console.log(buf.isEmpty()); // true
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Returns true if the buffer has reached maximum capacity.
   *
   * @returns {boolean} True if full.
   *
   * @example
   * const buf = new CircularBuffer<number>(2);
   * buf.write(1); buf.write(2);
   * console.log(buf.isFull()); // true
   */
  isFull(): boolean {
    return this.count === this.capacity;
  }

  /**
   * Returns the current number of elements in the buffer.
   *
   * @returns {number} Element count.
   *
   * @example
   * const buf = new CircularBuffer<number>(5);
   * buf.write(1);
   * console.log(buf.size()); // 1
   */
  size(): number {
    return this.count;
  }

  /**
   * Returns all current elements as an array, from oldest to newest.
   *
   * @returns {T[]} Snapshot of buffer contents.
   *
   * @example
   * const buf = new CircularBuffer<number>(3);
   * buf.write(1); buf.write(2);
   * console.log(buf.toArray()); // [1, 2]
   */
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      result.push(this.buffer[(this.head + i) % this.capacity] as T);
    }
    return result;
  }
}
