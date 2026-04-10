/**
 * A flexible report generator that supports tabular, summary, and CSV output.
 *
 * @example
 * const gen = new ReportGenerator('Sales Report');
 * gen.addRow({ product: 'Widget', sales: 100, revenue: 999 });
 * console.log(gen.toCSV());
 */
export class ReportGenerator {
  private title: string;
  private rows: Record<string, unknown>[] = [];
  private columns: string[] = [];

  /**
   * Creates a new ReportGenerator with the given title.
   *
   * @param {string} title - The report title.
   *
   * @example
   * const gen = new ReportGenerator('Monthly Revenue');
   */
  constructor(title: string) {
    this.title = title;
  }

  /**
   * Adds a data row to the report.
   * The keys of the first row determine the column headers.
   *
   * @param {Record<string, unknown>} row - An object representing a single record.
   * @returns {this} The generator instance for chaining.
   *
   * @example
   * const gen = new ReportGenerator('Test');
   * gen.addRow({ name: 'Alice', score: 95 });
   */
  addRow(row: Record<string, unknown>): this {
    if (this.columns.length === 0) {
      this.columns = Object.keys(row);
    }
    this.rows.push(row);
    return this;
  }

  /**
   * Adds multiple rows at once.
   *
   * @param {Record<string, unknown>[]} rows - Array of row objects.
   * @returns {this} The generator instance for chaining.
   *
   * @example
   * const gen = new ReportGenerator('Bulk');
   * gen.addRows([{ x: 1 }, { x: 2 }]);
   * console.log(gen.rowCount()); // 2
   */
  addRows(rows: Record<string, unknown>[]): this {
    rows.forEach(r => this.addRow(r));
    return this;
  }

  /**
   * Exports the report data as a CSV string.
   *
   * @param {string} [delimiter=','] - The field delimiter.
   * @returns {string} CSV-formatted string including header row.
   *
   * @example
   * const gen = new ReportGenerator('Test');
   * gen.addRow({ a: 1, b: 'hello' });
   * console.log(gen.toCSV());
   * // a,b
   * // 1,hello
   */
  toCSV(delimiter: string = ','): string {
    if (this.rows.length === 0) return '';
    const escape = (v: unknown) => {
      const s = String(v ?? '');
      return s.includes(delimiter) || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = this.columns.map(escape).join(delimiter);
    const body = this.rows.map(row =>
      this.columns.map(col => escape(row[col])).join(delimiter)
    ).join('\n');
    return `${header}\n${body}`;
  }

  /**
   * Returns summary statistics for a numeric column.
   *
   * @param {string} column - The column name to summarize.
   * @returns {{ min: number; max: number; sum: number; avg: number; count: number }} Summary stats.
   * @throws {Error} If the column does not exist or contains no numeric values.
   *
   * @example
   * const gen = new ReportGenerator('Stats');
   * gen.addRows([{ val: 10 }, { val: 20 }, { val: 30 }]);
   * const stats = gen.summarize('val');
   * console.log(stats.avg); // 20
   */
  summarize(column: string): { min: number; max: number; sum: number; avg: number; count: number } {
    const values = this.rows
      .map(r => Number(r[column]))
      .filter(n => !isNaN(n));
    if (values.length === 0) throw new Error(`No numeric values found in column '${column}'`);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      sum,
      avg: sum / values.length,
      count: values.length,
    };
  }

  /**
   * Returns the number of rows added to the report.
   *
   * @returns {number} Row count.
   *
   * @example
   * const gen = new ReportGenerator('Count');
   * gen.addRow({ x: 1 });
   * console.log(gen.rowCount()); // 1
   */
  rowCount(): number {
    return this.rows.length;
  }

  /**
   * Renders a simple plain-text table representation of the report.
   *
   * @returns {string} The formatted table string.
   *
   * @example
   * const gen = new ReportGenerator('Demo');
   * gen.addRow({ name: 'Alice', score: 90 });
   * console.log(gen.toTable());
   */
  toTable(): string {
    if (this.rows.length === 0) return `${this.title}\n(no data)`;
    const widths = this.columns.map(col =>
      Math.max(col.length, ...this.rows.map(r => String(r[col] ?? '').length))
    );
    const line = widths.map(w => '-'.repeat(w + 2)).join('+');
    const format = (values: string[]) => values.map((v, i) => v.padEnd(widths[i])).join(' | ');
    const header = format(this.columns);
    const body = this.rows.map(r => format(this.columns.map(c => String(r[c] ?? '')))).join('\n');
    return `${this.title}\n${line}\n${header}\n${line}\n${body}\n${line}`;
  }
}
