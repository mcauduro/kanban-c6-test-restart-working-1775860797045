/**
 * Interface that all commands must implement.
 */
export interface ICommand {
  execute(): void;
  undo(): void;
  description: string;
}

/**
 * Command invoker that manages a history of executed commands with undo/redo support.
 * Implements the Command design pattern.
 *
 * @example
 * const invoker = new CommandInvoker();
 * invoker.execute(new SetValueCommand(obj, 'key', 'newValue'));
 * invoker.undo();
 */
export class CommandInvoker {
  private history: ICommand[] = [];
  private redoStack: ICommand[] = [];

  /**
   * Executes a command and stores it in the history.
   *
   * @param {ICommand} command - The command to execute.
   * @returns {void}
   *
   * @example
   * const invoker = new CommandInvoker();
   * invoker.execute({ execute: () => console.log('done'), undo: () => {}, description: 'test' });
   */
  execute(command: ICommand): void {
    command.execute();
    this.history.push(command);
    this.redoStack = []; // clear redo on new action
  }

  /**
   * Undoes the last executed command.
   *
   * @returns {boolean} True if a command was undone.
   *
   * @example
   * const invoker = new CommandInvoker();
   * invoker.execute({ execute: () => {}, undo: () => console.log('undone'), description: 'x' });
   * invoker.undo(); // true
   */
  undo(): boolean {
    const command = this.history.pop();
    if (!command) return false;
    command.undo();
    this.redoStack.push(command);
    return true;
  }

  /**
   * Redoes the last undone command.
   *
   * @returns {boolean} True if a command was redone.
   *
   * @example
   * const invoker = new CommandInvoker();
   * invoker.execute({ execute: () => {}, undo: () => {}, description: 'y' });
   * invoker.undo();
   * invoker.redo(); // true
   */
  redo(): boolean {
    const command = this.redoStack.pop();
    if (!command) return false;
    command.execute();
    this.history.push(command);
    return true;
  }

  /**
   * Returns a list of executed command descriptions in chronological order.
   *
   * @returns {string[]} Array of command descriptions.
   *
   * @example
   * const invoker = new CommandInvoker();
   * invoker.execute({ execute: () => {}, undo: () => {}, description: 'paint red' });
   * console.log(invoker.getHistory()); // ['paint red']
   */
  getHistory(): string[] {
    return this.history.map(c => c.description);
  }

  /**
   * Clears both the history and redo stacks.
   *
   * @returns {void}
   *
   * @example
   * const invoker = new CommandInvoker();
   * invoker.clearHistory();
   * console.log(invoker.getHistory()); // []
   */
  clearHistory(): void {
    this.history = [];
    this.redoStack = [];
  }

  /**
   * Returns whether there are commands available to undo.
   *
   * @returns {boolean} True if undo is possible.
   *
   * @example
   * const invoker = new CommandInvoker();
   * console.log(invoker.canUndo()); // false
   */
  canUndo(): boolean {
    return this.history.length > 0;
  }

  /**
   * Returns whether there are commands available to redo.
   *
   * @returns {boolean} True if redo is possible.
   *
   * @example
   * const invoker = new CommandInvoker();
   * console.log(invoker.canRedo()); // false
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
