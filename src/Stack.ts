/**
 * A generic stack data structure implementing LIFO (Last In, First Out) semantics.
 *
 * @template T The type of elements stored in the stack.
 *
 * @example
 * const stack = new Stack<number>();
 * stack.push(1);
 * stack.push(2);
 * console.log(stack.pop()); // 2
 */
export class Stack<T> {
  private items: T[] = [];

  /**
   * Pushes a new element onto the top of the stack.
   *
   * @param {T} item - The element to push.
   * @returns {void}
   *
   * @example
   * const stack = new Stack<string>();
   * stack.push('a');
   * stack.push('b');
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the top element of the stack.
   *
   * @returns {T} The top element.
   * @throws {Error} If the stack is empty.
   *
   * @example
   * const stack = new Stack<number>();
   * stack.push(42);
   * console.log(stack.pop()); // 42
   */
  pop(): T {
    if (this.isEmpty()) throw new Error('Stack underflow: cannot pop from empty stack');
    return this.items.pop()!;
  }

  /**
   * Returns the top element without removing it.
   *
   * @returns {T} The top element.
   * @throws {Error} If the stack is empty.
   *
   * @example
   * const stack = new Stack<number>();
   * stack.push(10);
   * console.log(stack.peek()); // 10
   * console.log(stack.size()); // still 1
   */
  peek(): T {
    if (this.isEmpty()) throw new Error('Stack is empty');
    return this.items[this.items.length - 1];
  }

  /**
   * Returns true if the stack has no elements.
   *
   * @returns {boolean} True if empty, false otherwise.
   *
   * @example
   * const stack = new Stack<number>();
   * console.log(stack.isEmpty()); // true
   * stack.push(1);
   * console.log(stack.isEmpty()); // false
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns the number of elements currently in the stack.
   *
   * @returns {number} The stack size.
   *
   * @example
   * const stack = new Stack<string>();
   * stack.push('x');
   * stack.push('y');
   * console.log(stack.size()); // 2
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Removes all elements from the stack.
   *
   * @returns {void}
   *
   * @example
   * const stack = new Stack<number>();
   * stack.push(1);
   * stack.push(2);
   * stack.clear();
   * console.log(stack.size()); // 0
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Returns a copy of the stack contents as an array, from bottom to top.
   *
   * @returns {T[]} Array representation of the stack.
   *
   * @example
   * const stack = new Stack<number>();
   * stack.push(1);
   * stack.push(2);
   * console.log(stack.toArray()); // [1, 2]
   */
  toArray(): T[] {
    return [...this.items];
  }
}
