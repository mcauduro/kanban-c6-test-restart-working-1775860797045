/**
 * A generic directed weighted graph using an adjacency list representation.
 *
 * @template T The type of vertex identifiers (string or number).
 *
 * @example
 * const graph = new Graph<string>();
 * graph.addVertex('A');
 * graph.addEdge('A', 'B', 1);
 */
export class Graph<T extends string | number> {
  private adjacency: Map<T, Map<T, number>> = new Map();

  /**
   * Adds a new vertex to the graph. No-op if the vertex already exists.
   *
   * @param {T} vertex - The vertex to add.
   * @returns {void}
   *
   * @example
   * const graph = new Graph<string>();
   * graph.addVertex('A');
   * graph.addVertex('B');
   */
  addVertex(vertex: T): void {
    if (!this.adjacency.has(vertex)) {
      this.adjacency.set(vertex, new Map());
    }
  }

  /**
   * Adds a directed edge from `from` to `to` with the given weight.
   * Automatically creates vertices if they do not exist.
   *
   * @param {T} from - The source vertex.
   * @param {T} to - The destination vertex.
   * @param {number} [weight=1] - The edge weight.
   * @returns {void}
   *
   * @example
   * const graph = new Graph<string>();
   * graph.addEdge('A', 'B', 5);
   */
  addEdge(from: T, to: T, weight: number = 1): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adjacency.get(from)!.set(to, weight);
  }

  /**
   * Removes a directed edge from `from` to `to`.
   *
   * @param {T} from - The source vertex.
   * @param {T} to - The destination vertex.
   * @returns {boolean} True if the edge existed and was removed.
   *
   * @example
   * const graph = new Graph<string>();
   * graph.addEdge('A', 'B');
   * console.log(graph.removeEdge('A', 'B')); // true
   */
  removeEdge(from: T, to: T): boolean {
    return this.adjacency.get(from)?.delete(to) ?? false;
  }

  /**
   * Performs a Breadth-First Search starting from the given vertex.
   *
   * @param {T} start - The starting vertex.
   * @returns {T[]} Vertices visited in BFS order.
   * @throws {Error} If the start vertex does not exist.
   *
   * @example
   * const graph = new Graph<string>();
   * graph.addEdge('A', 'B');
   * graph.addEdge('A', 'C');
   * console.log(graph.bfs('A')); // ['A', 'B', 'C']
   */
  bfs(start: T): T[] {
    if (!this.adjacency.has(start)) throw new Error(`Vertex ${start} not found`);
    const visited = new Set<T>();
    const queue: T[] = [start];
    const result: T[] = [];
    visited.add(start);
    while (queue.length) {
      const vertex = queue.shift()!;
      result.push(vertex);
      for (const neighbor of this.adjacency.get(vertex)!.keys()) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return result;
  }

  /**
   * Performs a Depth-First Search starting from the given vertex.
   *
   * @param {T} start - The starting vertex.
   * @returns {T[]} Vertices visited in DFS order.
   * @throws {Error} If the start vertex does not exist.
   *
   * @example
   * const graph = new Graph<string>();
   * graph.addEdge('A', 'B');
   * graph.addEdge('B', 'C');
   * console.log(graph.dfs('A')); // ['A', 'B', 'C']
   */
  dfs(start: T): T[] {
    if (!this.adjacency.has(start)) throw new Error(`Vertex ${start} not found`);
    const visited = new Set<T>();
    const result: T[] = [];
    const explore = (v: T) => {
      visited.add(v);
      result.push(v);
      for (const neighbor of this.adjacency.get(v)!.keys()) {
        if (!visited.has(neighbor)) explore(neighbor);
      }
    };
    explore(start);
    return result;
  }

  /**
   * Computes the shortest path from `start` to all other vertices using Dijkstra's algorithm.
   *
   * @param {T} start - The source vertex.
   * @returns {Map<T, number>} A map from vertex to shortest distance from start.
   * @throws {Error} If the start vertex does not exist.
   *
   * @example
   * const graph = new Graph<string>();
   * graph.addEdge('A', 'B', 1);
   * graph.addEdge('A', 'C', 4);
   * graph.addEdge('B', 'C', 2);
   * const dist = graph.dijkstra('A');
   * console.log(dist.get('C')); // 3
   */
  dijkstra(start: T): Map<T, number> {
    if (!this.adjacency.has(start)) throw new Error(`Vertex ${start} not found`);
    const dist = new Map<T, number>();
    for (const v of this.adjacency.keys()) dist.set(v, Infinity);
    dist.set(start, 0);
    const unvisited = new Set(this.adjacency.keys());
    while (unvisited.size) {
      let u: T | null = null;
      for (const v of unvisited) {
        if (u === null || dist.get(v)! < dist.get(u)!) u = v;
      }
      if (u === null || dist.get(u)! === Infinity) break;
      unvisited.delete(u);
      for (const [neighbor, weight] of this.adjacency.get(u)!) {
        const alt = dist.get(u)! + weight;
        if (alt < dist.get(neighbor)!) dist.set(neighbor, alt);
      }
    }
    return dist;
  }

  /**
   * Returns the list of all vertices in the graph.
   *
   * @returns {T[]} All vertex identifiers.
   *
   * @example
   * const graph = new Graph<string>();
   * graph.addVertex('X');
   * graph.addVertex('Y');
   * console.log(graph.vertices()); // ['X', 'Y']
   */
  vertices(): T[] {
    return Array.from(this.adjacency.keys());
  }
}
