/**
 * Interface representing any entity with an id.
 */
export interface Entity {
  id: string;
}

/**
 * Generic in-memory Repository implementing the Repository design pattern.
 * Provides CRUD operations for entities identified by string IDs.
 *
 * @template T The entity type (must have an `id: string` field).
 *
 * @example
 * interface User extends Entity { name: string; }
 * const repo = new Repository<User>();
 * repo.save({ id: '1', name: 'Alice' });
 * console.log(repo.findById('1')); // { id: '1', name: 'Alice' }
 */
export class Repository<T extends Entity> {
  private store: Map<string, T> = new Map();

  /**
   * Saves (creates or updates) an entity in the repository.
   *
   * @param {T} entity - The entity to persist.
   * @returns {T} The saved entity.
   *
   * @example
   * const repo = new Repository<{ id: string; value: number }>();
   * const saved = repo.save({ id: 'abc', value: 42 });
   */
  save(entity: T): T {
    this.store.set(entity.id, { ...entity });
    return entity;
  }

  /**
   * Finds an entity by its ID.
   *
   * @param {string} id - The entity ID to look up.
   * @returns {T | undefined} The entity, or undefined if not found.
   *
   * @example
   * const repo = new Repository<{ id: string; name: string }>();
   * repo.save({ id: '1', name: 'Bob' });
   * console.log(repo.findById('1')?.name); // 'Bob'
   */
  findById(id: string): T | undefined {
    return this.store.get(id);
  }

  /**
   * Returns all entities in the repository.
   *
   * @returns {T[]} Array of all stored entities.
   *
   * @example
   * const repo = new Repository<{ id: string }>();
   * repo.save({ id: 'x' });
   * repo.save({ id: 'y' });
   * console.log(repo.findAll().length); // 2
   */
  findAll(): T[] {
    return Array.from(this.store.values());
  }

  /**
   * Finds entities that match a given predicate.
   *
   * @param {(entity: T) => boolean} predicate - The filter function.
   * @returns {T[]} Array of matching entities.
   *
   * @example
   * interface Product extends Entity { price: number; }
   * const repo = new Repository<Product>();
   * repo.save({ id: '1', price: 10 });
   * repo.save({ id: '2', price: 50 });
   * const expensive = repo.findWhere(p => p.price > 20);
   * console.log(expensive.length); // 1
   */
  findWhere(predicate: (entity: T) => boolean): T[] {
    return this.findAll().filter(predicate);
  }

  /**
   * Deletes an entity by its ID.
   *
   * @param {string} id - The ID of the entity to delete.
   * @returns {boolean} True if the entity existed and was removed.
   *
   * @example
   * const repo = new Repository<{ id: string }>();
   * repo.save({ id: 'z' });
   * console.log(repo.delete('z')); // true
   * console.log(repo.delete('z')); // false
   */
  delete(id: string): boolean {
    return this.store.delete(id);
  }

  /**
   * Returns the total number of entities in the repository.
   *
   * @returns {number} Entity count.
   *
   * @example
   * const repo = new Repository<{ id: string }>();
   * console.log(repo.count()); // 0
   * repo.save({ id: '1' });
   * console.log(repo.count()); // 1
   */
  count(): number {
    return this.store.size;
  }
}
