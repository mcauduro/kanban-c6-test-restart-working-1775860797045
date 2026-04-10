/**
 * Represents a node in a Binary Search Tree.
 * @template T The type of value stored.
 */
class BSTNode<T> {
  value: T;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * A generic Binary Search Tree (BST) implementation.
 * Elements must be comparable via standard comparison operators.
 *
 * @template T The type of elements; must extend number | string for comparison.
 *
 * @example
 * const bst = new BinarySearchTree<number>();
 * bst.insert(5);
 * bst.insert(3);
 * bst.insert(7);
 * console.log(bst.contains(3)); // true
 */
export class BinarySearchTree<T extends number | string> {
  private root: BSTNode<T> | null = null;

  /**
   * Inserts a new value into the BST.
   *
   * @param {T} value - The value to insert.
   * @returns {void}
   *
   * @example
   * const bst = new BinarySearchTree<number>();
   * bst.insert(10);
   * bst.insert(5);
   * bst.insert(15);
   */
  insert(value: T): void {
    const node = new BSTNode(value);
    if (!this.root) {
      this.root = node;
      return;
    }
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) { current.left = node; return; }
        current = current.left;
      } else {
        if (!current.right) { current.right = node; return; }
        current = current.right;
      }
    }
  }

  /**
   * Checks whether the BST contains the given value.
   *
   * @param {T} value - The value to search for.
   * @returns {boolean} True if the value exists, false otherwise.
   *
   * @example
   * const bst = new BinarySearchTree<number>();
   * bst.insert(5);
   * console.log(bst.contains(5)); // true
   * console.log(bst.contains(99)); // false
   */
  contains(value: T): boolean {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }

  /**
   * Returns the in-order traversal of the BST (sorted ascending).
   *
   * @returns {T[]} Array of values in ascending order.
   *
   * @example
   * const bst = new BinarySearchTree<number>();
   * [5, 3, 7, 1].forEach(v => bst.insert(v));
   * console.log(bst.inOrder()); // [1, 3, 5, 7]
   */
  inOrder(): T[] {
    const result: T[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * Returns the pre-order traversal of the BST (root, left, right).
   *
   * @returns {T[]} Array of values in pre-order.
   *
   * @example
   * const bst = new BinarySearchTree<number>();
   * [5, 3, 7].forEach(v => bst.insert(v));
   * console.log(bst.preOrder()); // [5, 3, 7]
   */
  preOrder(): T[] {
    const result: T[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      result.push(node.value);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * Finds and returns the minimum value in the BST.
   *
   * @returns {T | null} The minimum value, or null if the tree is empty.
   *
   * @example
   * const bst = new BinarySearchTree<number>();
   * [5, 3, 7].forEach(v => bst.insert(v));
   * console.log(bst.min()); // 3
   */
  min(): T | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.left) current = current.left;
    return current.value;
  }

  /**
   * Finds and returns the maximum value in the BST.
   *
   * @returns {T | null} The maximum value, or null if the tree is empty.
   *
   * @example
   * const bst = new BinarySearchTree<number>();
   * [5, 3, 7].forEach(v => bst.insert(v));
   * console.log(bst.max()); // 7
   */
  max(): T | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.right) current = current.right;
    return current.value;
  }

  /**
   * Returns the height (maximum depth) of the BST.
   *
   * @returns {number} The height of the tree. Returns 0 for empty tree.
   *
   * @example
   * const bst = new BinarySearchTree<number>();
   * [5, 3, 7, 1].forEach(v => bst.insert(v));
   * console.log(bst.height()); // 3
   */
  height(): number {
    const getHeight = (node: BSTNode<T> | null): number => {
      if (!node) return 0;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };
    return getHeight(this.root);
  }
}
