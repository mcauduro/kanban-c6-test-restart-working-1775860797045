/**
 * Represents the result of a paginated query.
 * @template T The element type.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Utility class for paginating, filtering, and sorting in-memory collections.
 *
 * @template T The type of items in the collection.
 *
 * @example
 * const paginator = new Pagination([1, 2, 3, 4, 5]);
 * const result = paginator.paginate(1, 2);
 * console.log(result.data); // [1, 2]
 */
export class Pagination<T> {
  private source: T[];

  /**
   * Creates a new Pagination instance wrapping the given collection.
   *
   * @param {T[]} source - The full data source to paginate.
   *
   * @example
   * const pager = new Pagination<number>([1, 2, 3]);
   */
  constructor(source: T[]) {
    this.source = [...source];
  }

  /**
   * Returns a paginated slice of the source collection.
   *
   * @param {number} page - The 1-based page number.
   * @param {number} limit - Number of items per page.
   * @returns {PaginatedResult<T>} The page result object.
   * @throws {Error} If page < 1 or limit < 1.
   *
   * @example
   * const pager = new Pagination([1, 2, 3, 4, 5]);
   * const result = pager.paginate(2, 2);
   * console.log(result.data); // [3, 4]
   * console.log(result.hasNextPage); // true
   */
  paginate(page: number, limit: number): PaginatedResult<T> {
    if (page < 1) throw new Error('page must be >= 1');
    if (limit < 1) throw new Error('limit must be >= 1');
    const total = this.source.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = this.source.slice(start, start + limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * Filters the source collection and returns a new Pagination over the result.
   *
   * @param {(item: T) => boolean} predicate - Filter function.
   * @returns {Pagination<T>} A new Pagination wrapping the filtered collection.
   *
   * @example
   * const pager = new Pagination([1, 2, 3, 4, 5]);
   * const evens = pager.filter(n => n % 2 === 0);
   * console.log(evens.paginate(1, 10).data); // [2, 4]
   */
  filter(predicate: (item: T) => boolean): Pagination<T> {
    return new Pagination(this.source.filter(predicate));
  }

  /**
   * Sorts the source collection using a comparator and returns a new Pagination.
   *
   * @param {(a: T, b: T) => number} comparator - Comparison function (same as Array.sort).
   * @returns {Pagination<T>} A new Pagination over the sorted collection.
   *
   * @example
   * const pager = new Pagination([3, 1, 4, 1, 5]);
   * const sorted = pager.sort((a, b) => a - b);
   * console.log(sorted.paginate(1, 5).data); // [1, 1, 3, 4, 5]
   */
  sort(comparator: (a: T, b: T) => number): Pagination<T> {
    return new Pagination([...this.source].sort(comparator));
  }

  /**
   * Returns the total number of items in the source collection.
   *
   * @returns {number} Item count.
   *
   * @example
   * const pager = new Pagination([10, 20, 30]);
   * console.log(pager.count()); // 3
   */
  count(): number {
    return this.source.length;
  }

  /**
   * Returns all items as a plain array.
   *
   * @returns {T[]} Copy of the source array.
   *
   * @example
   * const pager = new Pagination([1, 2]);
   * console.log(pager.toArray()); // [1, 2]
   */
  toArray(): T[] {
    return [...this.source];
  }
}
