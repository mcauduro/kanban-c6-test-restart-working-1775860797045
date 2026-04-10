/**
 * Represents a user entity in the system.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  active: boolean;
}

/**
 * Service class encapsulating business logic for user management.
 * Operates on an in-memory store; replace the store with a real DB adapter as needed.
 *
 * @example
 * const service = new UserService();
 * const user = service.createUser({ name: 'Alice', email: 'alice@example.com' });
 */
export class UserService {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> id

  /**
   * Creates and persists a new user with a generated ID.
   *
   * @param {{ name: string; email: string; role?: User['role'] }} data - User creation data.
   * @returns {User} The created user.
   * @throws {Error} If a user with the same email already exists.
   *
   * @example
   * const service = new UserService();
   * const user = service.createUser({ name: 'Bob', email: 'bob@example.com' });
   * console.log(user.id); // some UUID-like string
   */
  createUser(data: { name: string; email: string; role?: User['role'] }): User {
    if (this.emailIndex.has(data.email)) {
      throw new Error(`User with email ${data.email} already exists`);
    }
    const id = Math.random().toString(36).slice(2, 11);
    const user: User = {
      id,
      name: data.name,
      email: data.email,
      role: data.role ?? 'user',
      createdAt: new Date(),
      active: true,
    };
    this.users.set(id, user);
    this.emailIndex.set(data.email, id);
    return { ...user };
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {string} id - The user ID.
   * @returns {User | undefined} The user or undefined if not found.
   *
   * @example
   * const service = new UserService();
   * const user = service.createUser({ name: 'Carol', email: 'carol@test.com' });
   * console.log(service.getUserById(user.id)?.name); // 'Carol'
   */
  getUserById(id: string): User | undefined {
    const user = this.users.get(id);
    return user ? { ...user } : undefined;
  }

  /**
   * Finds a user by their email address.
   *
   * @param {string} email - The email to look up.
   * @returns {User | undefined} The user or undefined if not found.
   *
   * @example
   * const service = new UserService();
   * service.createUser({ name: 'Dave', email: 'dave@test.com' });
   * console.log(service.getUserByEmail('dave@test.com')?.name); // 'Dave'
   */
  getUserByEmail(email: string): User | undefined {
    const id = this.emailIndex.get(email);
    return id ? this.getUserById(id) : undefined;
  }

  /**
   * Updates mutable fields of an existing user.
   *
   * @param {string} id - The user ID.
   * @param {Partial<Pick<User, 'name' | 'role' | 'active'>>} updates - Fields to update.
   * @returns {User} The updated user.
   * @throws {Error} If the user does not exist.
   *
   * @example
   * const service = new UserService();
   * const user = service.createUser({ name: 'Eve', email: 'eve@test.com' });
   * service.updateUser(user.id, { role: 'admin' });
   */
  updateUser(id: string, updates: Partial<Pick<User, 'name' | 'role' | 'active'>>): User {
    const user = this.users.get(id);
    if (!user) throw new Error(`User ${id} not found`);
    Object.assign(user, updates);
    return { ...user };
  }

  /**
   * Deactivates a user account (soft delete).
   *
   * @param {string} id - The user ID.
   * @returns {boolean} True if the user was found and deactivated.
   *
   * @example
   * const service = new UserService();
   * const user = service.createUser({ name: 'Frank', email: 'frank@test.com' });
   * service.deactivateUser(user.id); // true
   */
  deactivateUser(id: string): boolean {
    const user = this.users.get(id);
    if (!user) return false;
    user.active = false;
    return true;
  }

  /**
   * Returns all active users, optionally filtered by role.
   *
   * @param {User['role']} [role] - Optional role filter.
   * @returns {User[]} Array of matching users.
   *
   * @example
   * const service = new UserService();
   * service.createUser({ name: 'Admin', email: 'admin@test.com', role: 'admin' });
   * console.log(service.listUsers('admin').length); // 1
   */
  listUsers(role?: User['role']): User[] {
    const all = Array.from(this.users.values()).filter(u => u.active);
    return role ? all.filter(u => u.role === role) : all;
  }
}
