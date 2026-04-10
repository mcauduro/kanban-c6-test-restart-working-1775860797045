/**
 * A synchronous data transformation pipeline.
 * Each stage takes the output of the previous stage as input.
 *
 * @template T The input type.
 * @template R The final output type.
 *
 * @example
 * const result = new Pipeline<string>()
 *   .pipe(s => s.trim())
 *   .pipe(s => s.toUpperCase())
 *   .execute('  hello  ');
 * console.log(result); // 'HELLO'
 */
export class Pipeline<TInput, TOutput = TInput> {
  private stages: Array<(input: unknown) => unknown> = [];

  /**
   * Adds a transformation stage to the pipeline.
   *
   * @template TNext The output type after this stage.
   * @param {(input: TOutput) => TNext} fn - The transformation function.
   * @returns {Pipeline<TInput, TNext>} A new pipeline with the stage appended.
   *
   * @example
   * const pipeline = new Pipeline<number>()
   *   .pipe(n => n * 2)
   *   .pipe(n => n + 1);
   */
  pipe<TNext>(fn: (input: TOutput) => TNext): Pipeline<TInput, TNext> {
    const next = new Pipeline<TInput, TNext>();
    next.stages = [...this.stages, fn as (input: unknown) => unknown];
    return next;
  }

  /**
   * Executes all pipeline stages on the given input and returns the final output.
   *
   * @param {TInput} input - The initial value to process.
   * @returns {TOutput} The final transformed value.
   *
   * @example
   * const result = new Pipeline<number>()
   *   .pipe(n => n * 3)
   *   .execute(4);
   * console.log(result); // 12
   */
  execute(input: TInput): TOutput {
    return this.stages.reduce((acc, stage) => stage(acc), input as unknown) as TOutput;
  }

  /**
   * Executes the pipeline on each item of an array, returning a transformed array.
   *
   * @param {TInput[]} inputs - Array of input values.
   * @returns {TOutput[]} Array of transformed outputs.
   *
   * @example
   * const pipeline = new Pipeline<string>().pipe(s => s.toUpperCase());
   * console.log(pipeline.executeAll(['a', 'b', 'c'])); // ['A', 'B', 'C']
   */
  executeAll(inputs: TInput[]): TOutput[] {
    return inputs.map(input => this.execute(input));
  }

  /**
   * Returns the number of stages currently in the pipeline.
   *
   * @returns {number} Stage count.
   *
   * @example
   * const p = new Pipeline<number>().pipe(n => n + 1).pipe(n => n * 2);
   * console.log(p.stageCount()); // 2
   */
  stageCount(): number {
    return this.stages.length;
  }

  /**
   * Composes this pipeline with another, concatenating their stages.
   *
   * @template TFinal The output type of the other pipeline.
   * @param {Pipeline<TOutput, TFinal>} other - The pipeline to append.
   * @returns {Pipeline<TInput, TFinal>} A new combined pipeline.
   *
   * @example
   * const p1 = new Pipeline<string>().pipe(s => s.trim());
   * const p2 = new Pipeline<string>().pipe(s => s.toUpperCase());
   * const combined = p1.compose(p2);
   * console.log(combined.execute('  hello  ')); // 'HELLO'
   */
  compose<TFinal>(other: Pipeline<TOutput, TFinal>): Pipeline<TInput, TFinal> {
    const combined = new Pipeline<TInput, TFinal>();
    combined.stages = [...this.stages, ...other.stages];
    return combined;
  }

  /**
   * Creates a no-op pipeline (identity transform).
   *
   * @template T The data type.
   * @returns {Pipeline<T, T>} A pipeline that returns its input unchanged.
   *
   * @example
   * const identity = Pipeline.identity<number>();
   * console.log(identity.execute(42)); // 42
   */
  static identity<T>(): Pipeline<T, T> {
    return new Pipeline<T, T>();
  }
}
