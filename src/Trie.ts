/**
 * A node in the Trie.
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
}

/**
 * A Trie (prefix tree) data structure optimized for string storage and retrieval.
 * Supports insertion, search, prefix queries, deletion, and word enumeration.
 *
 * @example
 * const trie = new Trie();
 * trie.insert('apple');
 * trie.insert('app');
 * console.log(trie.search('app')); // true
 * console.log(trie.startsWith('app')); // true
 */
export class Trie {
  private root: TrieNode = new TrieNode();
  private wordCount: number = 0;

  /**
   * Inserts a word into the Trie.
   *
   * @param {string} word - The word to insert.
   * @returns {void}
   *
   * @example
   * const trie = new Trie();
   * trie.insert('hello');
   * console.log(trie.search('hello')); // true
   */
  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    if (!node.isEndOfWord) {
      node.isEndOfWord = true;
      this.wordCount++;
    }
  }

  /**
   * Returns true if the exact word exists in the Trie.
   *
   * @param {string} word - The word to look up.
   * @returns {boolean} True if the word is stored.
   *
   * @example
   * const trie = new Trie();
   * trie.insert('cat');
   * console.log(trie.search('cat'));  // true
   * console.log(trie.search('ca'));   // false
   */
  search(word: string): boolean {
    const node = this.findNode(word);
    return node?.isEndOfWord === true;
  }

  /**
   * Returns true if any inserted word starts with the given prefix.
   *
   * @param {string} prefix - The prefix to check.
   * @returns {boolean} True if there is at least one word with this prefix.
   *
   * @example
   * const trie = new Trie();
   * trie.insert('flower');
   * console.log(trie.startsWith('flo')); // true
   * console.log(trie.startsWith('xyz')); // false
   */
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  /**
   * Removes a word from the Trie if it exists.
   *
   * @param {string} word - The word to delete.
   * @returns {boolean} True if the word was found and removed.
   *
   * @example
   * const trie = new Trie();
   * trie.insert('dog');
   * console.log(trie.delete('dog')); // true
   * console.log(trie.search('dog')); // false
   */
  delete(word: string): boolean {
    return this.deleteHelper(this.root, word, 0);
  }

  /**
   * Returns all words in the Trie that start with the given prefix.
   *
   * @param {string} prefix - The prefix to query.
   * @returns {string[]} Array of words with the given prefix.
   *
   * @example
   * const trie = new Trie();
   * ['apple', 'app', 'application', 'bat'].forEach(w => trie.insert(w));
   * console.log(trie.autocomplete('app')); // ['app', 'apple', 'application']
   */
  autocomplete(prefix: string): string[] {
    const node = this.findNode(prefix);
    if (!node) return [];
    const results: string[] = [];
    this.collectWords(node, prefix, results);
    return results;
  }

  /**
   * Returns the total number of unique words stored in the Trie.
   *
   * @returns {number} Word count.
   *
   * @example
   * const trie = new Trie();
   * trie.insert('a');
   * trie.insert('b');
   * console.log(trie.size()); // 2
   */
  size(): number {
    return this.wordCount;
  }

  private findNode(prefix: string): TrieNode | null {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch)!;
    }
    return node;
  }

  private collectWords(node: TrieNode, current: string, results: string[]): void {
    if (node.isEndOfWord) results.push(current);
    for (const [ch, child] of node.children) {
      this.collectWords(child, current + ch, results);
    }
  }

  private deleteHelper(node: TrieNode, word: string, depth: number): boolean {
    if (depth === word.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      this.wordCount--;
      return true;
    }
    const ch = word[depth];
    const child = node.children.get(ch);
    if (!child) return false;
    const deleted = this.deleteHelper(child, word, depth + 1);
    if (deleted && child.children.size === 0 && !child.isEndOfWord) {
      node.children.delete(ch);
    }
    return deleted;
  }
}
