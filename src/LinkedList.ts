/**
 * Represents a node in a singly linked list.
 * @template T The type of data stored in the node.
 */
class ListNode<T> {
  data: T;
  next: ListNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

/**
 * A generic singly linked list implementation.
 * Supports standard operations like append, prepend, delete, search, reverse, and conversion.
 *
 * @template T The type of elements stored in the list.
 *
 * @example
 * const list = new LinkedList<number>();
 * list.append(1);
 * list.append(2);
 * list.append(3);
 * console.log(list.toArray()); // [1, 2, 3]
 */
export class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private size: number = 0;

  /**
   * Appends a new element at the end of the list.
   *
   * @param {T} data - The data to append.
   * @returns {void}
   *
   * @example
   * const list = new LinkedList<string>();
   * list.append('hello');
   * list.append('world');
   */
  append(data: T): void {
    const node = new ListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  /**
   * Prepends a new element at the beginning of the list.
   *
   * @param {T} data - The data to prepend.
   * @returns {void}
   *
   * @example
   * const list = new LinkedList<number>();
   * list.append(2);
   * list.prepend(1);
   * console.log(list.toArray()); // [1, 2]
   */
  prepend(data: T): void {
    const node = new ListNode(data);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  /**
   * Removes the first occurrence of the given value from the list.
   *
   * @param {T} data - The data to remove.
   * @returns {boolean} True if the element was found and removed, false otherwise.
   * @throws {Error} If the list is empty.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.append(1);
   * list.append(2);
   * list.delete(1); // returns true
   * console.log(list.toArray()); // [2]
   */
  delete(data: T): boolean {
    if (!this.head) throw new Error('List is empty');

    if (this.head.data === data) {
      this.head = this.head.next;
      this.size--;
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.data === data) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  /**
   * Searches for a value in the list and returns its zero-based index.
   *
   * @param {T} data - The data to search for.
   * @returns {number} The index of the element, or -1 if not found.
   *
   * @example
   * const list = new LinkedList<string>();
   * list.append('a');
   * list.append('b');
   * list.search('b'); // returns 1
   * list.search('z'); // returns -1
   */
  search(data: T): number {
    let current = this.head;
    let index = 0;
    while (current) {
      if (current.data === data) return index;
      current = current.next;
      index++;
    }
    return -1;
  }

  /**
   * Reverses the linked list in place.
   *
   * @returns {void}
   *
   * @example
   * const list = new LinkedList<number>();
   * list.append(1);
   * list.append(2);
   * list.append(3);
   * list.reverse();
   * console.log(list.toArray()); // [3, 2, 1]
   */
  reverse(): void {
    let prev: ListNode<T> | null = null;
    let current = this.head;
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }

  /**
   * Converts the linked list to a plain JavaScript array.
   *
   * @returns {T[]} An array containing all elements in list order.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.append(10);
   * list.append(20);
   * console.log(list.toArray()); // [10, 20]
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  /**
   * Returns the number of elements in the list.
   *
   * @returns {number} The size of the list.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.append(1);
   * console.log(list.length()); // 1
   */
  length(): number {
    return this.size;
  }
}
