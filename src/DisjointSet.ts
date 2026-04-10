/**
 * Disjoint Set Union (Union-Find) data structure with path compression and union by rank.
 * Efficiently answers connectivity queries: are two elements in the same set?
 *
 * @example
 * const dsu = new DisjointSet(5);
 * dsu.union(0, 1);
 * dsu.union(1, 2);
 * console.log(dsu.connected(0, 2)); // true
 * console.log(dsu.connected(0, 3)); // false
 */
export class DisjointSet {
  private parent: number[];
  private rank: number[];
  private setCount: number;

  /**
   * Creates a DisjointSet with `n` singleton sets (0 to n-1).
   *
   * @param {number} n - Number of elements.
   * @throws {Error} If n is not a positive integer.
   *
   * @example
   * const dsu = new DisjointSet(10);
   */
  constructor(n: number) {
    if (n <= 0 || !Number.isInteger(n)) throw new Error('n must be a positive integer');
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.setCount = n;
  }

  /**
   * Finds the representative (root) of the set containing element `x`.
   * Applies path compression for amortized O(α(n)) performance.
   *
   * @param {number} x - The element.
   * @returns {number} The root of x's set.
   *
   * @example
   * const dsu = new DisjointSet(3);
   * dsu.union(0, 1);
   * console.log(dsu.find(0) === dsu.find(1)); // true
   */
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  /**
   * Merges the sets containing elements `x` and `y`.
   * Uses union by rank to keep the tree shallow.
   *
   * @param {number} x - First element.
   * @param {number} y - Second element.
   * @returns {boolean} True if the elements were in different sets and were merged.
   *
   * @example
   * const dsu = new DisjointSet(4);
   * console.log(dsu.union(0, 1)); // true (merged)
   * console.log(dsu.union(0, 1)); // false (already same set)
   */
  union(x: number, y: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
    else { this.parent[ry] = rx; this.rank[rx]++; }
    this.setCount--;
    return true;
  }

  /**
   * Returns true if elements `x` and `y` belong to the same set.
   *
   * @param {number} x - First element.
   * @param {number} y - Second element.
   * @returns {boolean} True if connected.
   *
   * @example
   * const dsu = new DisjointSet(3);
   * dsu.union(0, 2);
   * console.log(dsu.connected(0, 2)); // true
   */
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  /**
   * Returns the number of disjoint sets currently present.
   *
   * @returns {number} Set count.
   *
   * @example
   * const dsu = new DisjointSet(5);
   * dsu.union(0, 1);
   * console.log(dsu.countSets()); // 4
   */
  countSets(): number {
    return this.setCount;
  }

  /**
   * Returns all elements grouped by their representative (root).
   *
   * @returns {Map<number, number[]>} A map from root to list of elements in that set.
   *
   * @example
   * const dsu = new DisjointSet(4);
   * dsu.union(0, 1);
   * const groups = dsu.getGroups();
   * // root of {0,1} -> [0, 1], root of {2} -> [2], root of {3} -> [3]
   */
  getGroups(): Map<number, number[]> {
    const groups = new Map<number, number[]>();
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(i);
    }
    return groups;
  }

  /**
   * Returns the size (number of elements) in the set containing element `x`.
   *
   * @param {number} x - The element.
   * @returns {number} Size of the set.
   *
   * @example
   * const dsu = new DisjointSet(5);
   * dsu.union(0, 1);
   * dsu.union(1, 2);
   * console.log(dsu.setSize(0)); // 3
   */
  setSize(x: number): number {
    const root = this.find(x);
    return this.getGroups().get(root)?.length ?? 0;
  }
}
