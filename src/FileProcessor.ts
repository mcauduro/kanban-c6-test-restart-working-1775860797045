/**
 * Metadata describing a parsed file.
 */
export interface FileMetadata {
  name: string;
  extension: string;
  sizeBytes: number;
  lineCount: number;
  wordCount: number;
  encoding: string;
}

/**
 * In-memory file processor for analyzing and transforming text file content.
 * Does not perform any real filesystem I/O — operates on strings.
 *
 * @example
 * const processor = new FileProcessor('notes.txt', 'Hello World\nLine two');
 * const meta = processor.getMetadata();
 * console.log(meta.lineCount); // 2
 */
export class FileProcessor {
  private filename: string;
  private content: string;

  /**
   * Creates a new FileProcessor.
   *
   * @param {string} filename - The name of the file (including extension).
   * @param {string} content - The raw text content of the file.
   *
   * @example
   * const fp = new FileProcessor('readme.md', '# Hello\nWorld');
   */
  constructor(filename: string, content: string) {
    this.filename = filename;
    this.content = content;
  }

  /**
   * Returns metadata about the file.
   *
   * @returns {FileMetadata} An object with file statistics.
   *
   * @example
   * const fp = new FileProcessor('test.txt', 'foo bar\nbaz');
   * const meta = fp.getMetadata();
   * console.log(meta.wordCount); // 3
   */
  getMetadata(): FileMetadata {
    const parts = this.filename.split('.');
    return {
      name: this.filename,
      extension: parts.length > 1 ? parts[parts.length - 1] : '',
      sizeBytes: new TextEncoder().encode(this.content).length,
      lineCount: this.countLines(),
      wordCount: this.countWords(),
      encoding: 'utf-8',
    };
  }

  /**
   * Returns the number of lines in the content.
   *
   * @returns {number} Line count (empty string returns 0).
   *
   * @example
   * const fp = new FileProcessor('a.txt', 'line1\nline2\nline3');
   * console.log(fp.countLines()); // 3
   */
  countLines(): number {
    if (!this.content) return 0;
    return this.content.split('\n').length;
  }

  /**
   * Returns the total number of words in the content.
   * Words are sequences of non-whitespace characters.
   *
   * @returns {number} Word count.
   *
   * @example
   * const fp = new FileProcessor('b.txt', 'hello world foo');
   * console.log(fp.countWords()); // 3
   */
  countWords(): number {
    return this.content.trim().split(/\s+/).filter(Boolean).length;
  }

  /**
   * Searches for all occurrences of a pattern in the file content.
   *
   * @param {RegExp | string} pattern - The pattern to search for.
   * @returns {string[]} Array of matched strings.
   *
   * @example
   * const fp = new FileProcessor('log.txt', 'ERROR: fail\nINFO: ok\nERROR: timeout');
   * console.log(fp.search(/ERROR: .+/g)); // ['ERROR: fail', 'ERROR: timeout']
   */
  search(pattern: RegExp | string): string[] {
    const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern;
    return this.content.match(regex) ?? [];
  }

  /**
   * Replaces all occurrences of a pattern in the content and returns the modified text.
   * Does not mutate the internal content.
   *
   * @param {RegExp | string} pattern - The pattern to replace.
   * @param {string} replacement - The replacement string.
   * @returns {string} The content with replacements applied.
   *
   * @example
   * const fp = new FileProcessor('c.txt', 'foo foo foo');
   * console.log(fp.replace('foo', 'bar')); // 'bar bar bar'
   */
  replace(pattern: RegExp | string, replacement: string): string {
    const regex = typeof pattern === 'string'
      ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      : pattern;
    return this.content.replace(regex, replacement);
  }

  /**
   * Returns the content split into individual lines.
   *
   * @returns {string[]} Array of lines (preserving empty lines).
   *
   * @example
   * const fp = new FileProcessor('d.txt', 'a\nb\nc');
   * console.log(fp.getLines()); // ['a', 'b', 'c']
   */
  getLines(): string[] {
    return this.content.split('\n');
  }

  /**
   * Filters and returns only the lines that match a given predicate.
   *
   * @param {(line: string) => boolean} predicate - Filter function applied to each line.
   * @returns {string[]} Matching lines.
   *
   * @example
   * const fp = new FileProcessor('e.txt', 'apple\nbanana\napricot');
   * console.log(fp.filterLines(l => l.startsWith('a'))); // ['apple', 'apricot']
   */
  filterLines(predicate: (line: string) => boolean): string[] {
    return this.getLines().filter(predicate);
  }
}
