/**
 * A generic min-heap based priority queue.
 * Elements with lower priority values are dequeued first.
 *
 * @template T The type of elements stored.
 *
 * @example
 * const pq = new PriorityQueue<string>();
 * pq.enqueue('low', 10);
 * pq.enqueue('high', 1);
 * console.log(pq.dequeue()); // 'high'
 */
export class PriorityQueue<T> {
  private heap: Array<{ value: T; priority: number }> = [];

  /**
   * Inserts a new element with the given priority into the queue.
   *
   * @param {T} value - The value to insert.
   * @param {number} priority - Lower numbers indicate higher priority.
   * @returns {void}
   *
   * @example
   * const pq = new PriorityQueue<string>();
   * pq.enqueue('task', 5);
   */
  enqueue(value: T, priority: number): void {
    this.heap.push({ value, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Removes and returns the element with the highest priority (lowest priority number).
   *
   * @returns {T} The highest-priority element.
   * @throws {Error} If the queue is empty.
   *
   * @example
   * const pq = new PriorityQueue<number>();
   * pq.enqueue(100, 2);
   * pq.enqueue(200, 1);
   * console.log(pq.dequeue()); // 200
   */
  dequeue(): T {
    if (this.isEmpty()) throw new Error('Priority queue is empty');
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top.value;
  }

  /**
   * Returns the highest-priority element without removing it.
   *
   * @returns {T} The front element.
   * @throws {Error} If the queue is empty.
   *
   * @example
   * const pq = new PriorityQueue<string>();
   * pq.enqueue('urgent', 1);
   * console.log(pq.peek()); // 'urgent'
   */
  peek(): T {
    if (this.isEmpty()) throw new Error('Priority queue is empty');
    return this.heap[0].value;
  }

  /**
   * Returns true if the priority queue has no elements.
   *
   * @returns {boolean} True if empty.
   *
   * @example
   * const pq = new PriorityQueue<number>();
   * console.log(pq.isEmpty()); // true
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Returns the number of elements in the priority queue.
   *
   * @returns {number} Queue size.
   *
   * @example
   * const pq = new PriorityQueue<number>();
   * pq.enqueue(1, 1);
   * console.log(pq.size()); // 1
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Moves an element up the heap to restore the heap property.
   *
   * @param {number} index - The index of the element to bubble up.
   * @returns {void}
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].priority <= this.heap[index].priority) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  /**
   * Moves an element down the heap to restore the heap property.
   *
   * @param {number} index - The index of the element to sink down.
   * @returns {void}
   */
  private sinkDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (left < length && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
      if (smallest === index) break;
      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}
