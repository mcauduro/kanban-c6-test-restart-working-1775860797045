/**
 * Represents a line item in an order.
 */
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Possible states an order can be in.
 */
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Represents a customer order.
 */
export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  total: number;
}

/**
 * Service class managing the lifecycle and business logic of customer orders.
 *
 * @example
 * const service = new OrderService();
 * const order = service.createOrder('customer-1', [{ productId: 'p1', name: 'Widget', quantity: 2, unitPrice: 9.99 }]);
 */
export class OrderService {
  private orders: Map<string, Order> = new Map();

  /**
   * Creates a new order for a customer with the specified items.
   *
   * @param {string} customerId - The ID of the customer placing the order.
   * @param {OrderItem[]} items - The line items to include.
   * @returns {Order} The newly created order.
   * @throws {Error} If the items array is empty.
   *
   * @example
   * const service = new OrderService();
   * const order = service.createOrder('cust-1', [
   *   { productId: 'prod-1', name: 'Book', quantity: 1, unitPrice: 29.99 }
   * ]);
   */
  createOrder(customerId: string, items: OrderItem[]): Order {
    if (items.length === 0) throw new Error('An order must have at least one item');
    const id = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const total = this.calculateTotal(items);
    const order: Order = { id, customerId, items: [...items], status: 'pending', createdAt: new Date(), total };
    this.orders.set(id, order);
    return { ...order };
  }

  /**
   * Calculates the grand total for a set of order items.
   *
   * @param {OrderItem[]} items - The items to total.
   * @returns {number} The sum of (quantity * unitPrice) for all items, rounded to 2 decimals.
   *
   * @example
   * const service = new OrderService();
   * const total = service.calculateTotal([{ productId: '1', name: 'A', quantity: 3, unitPrice: 5 }]);
   * console.log(total); // 15
   */
  calculateTotal(items: OrderItem[]): number {
    const sum = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    return Math.round(sum * 100) / 100;
  }

  /**
   * Transitions an order to a new status, enforcing the valid state machine.
   *
   * @param {string} orderId - The order to update.
   * @param {OrderStatus} newStatus - The target status.
   * @returns {Order} The updated order.
   * @throws {Error} If the order is not found or the transition is invalid.
   *
   * @example
   * const service = new OrderService();
   * const order = service.createOrder('c1', [{ productId: 'p1', name: 'X', quantity: 1, unitPrice: 1 }]);
   * service.updateStatus(order.id, 'confirmed');
   */
  updateStatus(orderId: string, newStatus: OrderStatus): Order {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };
    if (!validTransitions[order.status].includes(newStatus)) {
      throw new Error(`Invalid transition from '${order.status}' to '${newStatus}'`);
    }
    order.status = newStatus;
    return { ...order };
  }

  /**
   * Retrieves all orders for a given customer, optionally filtered by status.
   *
   * @param {string} customerId - The customer ID.
   * @param {OrderStatus} [status] - Optional status filter.
   * @returns {Order[]} Matching orders sorted by creation date descending.
   *
   * @example
   * const service = new OrderService();
   * service.createOrder('c1', [{ productId: 'p1', name: 'Y', quantity: 1, unitPrice: 5 }]);
   * const orders = service.getCustomerOrders('c1');
   * console.log(orders.length); // 1
   */
  getCustomerOrders(customerId: string, status?: OrderStatus): Order[] {
    return Array.from(this.orders.values())
      .filter(o => o.customerId === customerId && (!status || o.status === status))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Finds an order by its ID.
   *
   * @param {string} orderId - The order ID.
   * @returns {Order | undefined} The order or undefined if not found.
   *
   * @example
   * const service = new OrderService();
   * const order = service.createOrder('c1', [{ productId: 'p1', name: 'Z', quantity: 1, unitPrice: 3 }]);
   * console.log(service.getOrderById(order.id)?.status); // 'pending'
   */
  getOrderById(orderId: string): Order | undefined {
    const order = this.orders.get(orderId);
    return order ? { ...order } : undefined;
  }

  /**
   * Returns summary statistics across all orders.
   *
   * @returns {{ total: number; byStatus: Record<OrderStatus, number>; revenue: number }} Summary object.
   *
   * @example
   * const service = new OrderService();
   * const stats = service.getSummary();
   * console.log(stats.total); // 0
   */
  getSummary(): { total: number; byStatus: Record<OrderStatus, number>; revenue: number } {
    const byStatus: Record<OrderStatus, number> = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    let revenue = 0;
    for (const order of this.orders.values()) {
      byStatus[order.status]++;
      if (order.status !== 'cancelled') revenue += order.total;
    }
    return { total: this.orders.size, byStatus, revenue: Math.round(revenue * 100) / 100 };
  }
}
