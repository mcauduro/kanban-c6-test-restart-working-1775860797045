/**
 * A 2D matrix class supporting common linear algebra operations.
 *
 * @example
 * const m = new Matrix([[1, 2], [3, 4]]);
 * const t = m.transpose();
 * console.log(t.toArray()); // [[1, 3], [2, 4]]
 */
export class Matrix {
  private data: number[][];
  readonly rows: number;
  readonly cols: number;

  /**
   * Creates a new Matrix from a 2D array.
   *
   * @param {number[][]} data - Row-major 2D array. All rows must have the same length.
   * @throws {Error} If the matrix is empty or rows have inconsistent lengths.
   *
   * @example
   * const m = new Matrix([[1, 2, 3], [4, 5, 6]]);
   */
  constructor(data: number[][]) {
    if (!data.length || !data[0].length) throw new Error('Matrix must not be empty');
    const cols = data[0].length;
    if (data.some(row => row.length !== cols)) throw new Error('All rows must have the same length');
    this.data = data.map(row => [...row]);
    this.rows = data.length;
    this.cols = cols;
  }

  /**
   * Returns the element at the specified (row, column) position.
   *
   * @param {number} row - Zero-based row index.
   * @param {number} col - Zero-based column index.
   * @returns {number} The element value.
   * @throws {Error} If indices are out of range.
   *
   * @example
   * const m = new Matrix([[10, 20], [30, 40]]);
   * console.log(m.get(1, 0)); // 30
   */
  get(row: number, col: number): number {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error(`Index out of range: (${row}, ${col})`);
    }
    return this.data[row][col];
  }

  /**
   * Returns the transpose of the matrix (rows become columns).
   *
   * @returns {Matrix} A new transposed Matrix.
   *
   * @example
   * const m = new Matrix([[1, 2], [3, 4]]);
   * console.log(m.transpose().toArray()); // [[1, 3], [2, 4]]
   */
  transpose(): Matrix {
    const result = Array.from({ length: this.cols }, (_, c) =>
      Array.from({ length: this.rows }, (_, r) => this.data[r][c])
    );
    return new Matrix(result);
  }

  /**
   * Adds another matrix element-wise and returns the result.
   *
   * @param {Matrix} other - The matrix to add. Must have the same dimensions.
   * @returns {Matrix} A new Matrix with summed elements.
   * @throws {Error} If dimensions do not match.
   *
   * @example
   * const a = new Matrix([[1, 2], [3, 4]]);
   * const b = new Matrix([[10, 20], [30, 40]]);
   * console.log(a.add(b).toArray()); // [[11, 22], [33, 44]]
   */
  add(other: Matrix): Matrix {
    if (other.rows !== this.rows || other.cols !== this.cols) {
      throw new Error('Matrix dimensions must match for addition');
    }
    return new Matrix(
      this.data.map((row, r) => row.map((v, c) => v + other.data[r][c]))
    );
  }

  /**
   * Multiplies this matrix by another using standard matrix multiplication.
   *
   * @param {Matrix} other - The matrix to multiply with. Its row count must equal this matrix's column count.
   * @returns {Matrix} The product matrix.
   * @throws {Error} If dimensions are incompatible.
   *
   * @example
   * const a = new Matrix([[1, 2], [3, 4]]);
   * const b = new Matrix([[5, 6], [7, 8]]);
   * const c = a.multiply(b);
   * console.log(c.get(0, 0)); // 19
   */
  multiply(other: Matrix): Matrix {
    if (this.cols !== other.rows) throw new Error('Incompatible matrix dimensions for multiplication');
    const result = Array.from({ length: this.rows }, (_, r) =>
      Array.from({ length: other.cols }, (_, c) =>
        this.data[r].reduce((sum, _, k) => sum + this.data[r][k] * other.data[k][c], 0)
      )
    );
    return new Matrix(result);
  }

  /**
   * Scales all elements by a scalar value.
   *
   * @param {number} scalar - The multiplier.
   * @returns {Matrix} A new scaled Matrix.
   *
   * @example
   * const m = new Matrix([[1, 2], [3, 4]]);
   * console.log(m.scale(2).toArray()); // [[2, 4], [6, 8]]
   */
  scale(scalar: number): Matrix {
    return new Matrix(this.data.map(row => row.map(v => v * scalar)));
  }

  /**
   * Returns the raw 2D array representation of the matrix.
   *
   * @returns {number[][]} Deep copy of the internal data.
   *
   * @example
   * const m = new Matrix([[1, 2], [3, 4]]);
   * console.log(m.toArray()); // [[1, 2], [3, 4]]
   */
  toArray(): number[][] {
    return this.data.map(row => [...row]);
  }
}
