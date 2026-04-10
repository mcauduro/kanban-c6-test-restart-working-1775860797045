/**
 * A generic queue data structure implementing FIFO (First In, First Out) semantics.
 * Uses a circular-buffer-style approach with head/tail pointers for O(1) enqueue and dequeue.
 *
 * @template T The type of elements stored in the queue.
 *
 * @example
 * const queue = new Queue<number>();
 * queue.enqueue(1);
 * queue.enqueue(2);
 * console.log(queue.dequeue()); // 1
 */
export class Queue<T> {
  private items: Map<number, T> = new Map();
  private head: number = 0;
  private tail: number = 0;

  /**
   * Adds a new element to the back of the queue.
   *
   * @param {T} item - The element to enqueue.
   * @returns {void}
   *
   * @example
   * const queue = new Queue<string>();
   * queue.enqueue('first');
   * queue.enqueue('second');
   */
  enqueue(item: T): void {
    this.items.set(this.tail, item);
    this.tail++;
  }

  /**
   * Removes and returns the front element of the queue.
   *
   * @returns {T} The front element.
   * @throws {Error} If the queue is empty.
   *
   * @example
   * const queue = new Queue<number>();
   * queue.enqueue(10);
   * queue.enqueue(20);
   * console.log(queue.dequeue()); // 10
   */
  dequeue(): T {
    if (this.isEmpty()) throw new Error('Queue underflow: cannot dequeue from empty queue');
    const item = this.items.get(this.head)!;
    this.items.delete(this.head);
    this.head++;
    return item;
  }

  /**
   * Returns the front element without removing it.
   *
   * @returns {T} The front element.
   * @throws {Error} If the queue is empty.
   *
   * @example
   * const queue = new Queue<string>();
   * queue.enqueue('hello');
   * console.log(queue.front()); // 'hello'
   */
  front(): T {
    if (this.isEmpty()) throw new Error('Queue is empty');
    return this.items.get(this.head)!;
  }

  /**
   * Returns the rear element without removing it.
   *
   * @returns {T} The rear element.
   * @throws {Error} If the queue is empty.
   *
   * @example
   * const queue = new Queue<number>();
   * queue.enqueue(1);
   * queue.enqueue(2);
   * console.log(queue.rear()); // 2
   */
  rear(): T {
    if (this.isEmpty()) throw new Error('Queue is empty');
    return this.items.get(this.tail - 1)!;
  }

  /**
   * Returns true if the queue has no elements.
   *
   * @returns {boolean} True if empty, false otherwise.
   *
   * @example
   * const queue = new Queue<number>();
   * console.log(queue.isEmpty()); // true
   */
  isEmpty(): boolean {
    return this.tail - this.head === 0;
  }

  /**
   * Returns the number of elements in the queue.
   *
   * @returns {number} Queue size.
   *
   * @example
   * const queue = new Queue<number>();
   * queue.enqueue(1);
   * queue.enqueue(2);
   * console.log(queue.size()); // 2
   */
  size(): number {
    return this.tail - this.head;
  }

  /**
   * Converts the queue to an array from front to rear.
   *
   * @returns {T[]} Array representation of the queue.
   *
   * @example
   * const queue = new Queue<number>();
   * queue.enqueue(1);
   * queue.enqueue(2);
   * console.log(queue.toArray()); // [1, 2]
   */
  toArray(): T[] {
    const result: T[] = [];
    for (let i = this.head; i < this.tail; i++) {
      result.push(this.items.get(i)!);
    }
    return result;
  }
}
