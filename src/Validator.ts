/**
 * Fluent validation builder for common data types.
 * Chain validation rules and collect errors.
 *
 * @example
 * const errors = new Validator('user@example.com').isEmail().maxLength(100).validate();
 * if (errors.length === 0) console.log('Valid!');
 */
export class Validator {
  private value: string;
  private fieldName: string;
  private errors: string[] = [];

  /**
   * Creates a new Validator for the given value.
   *
   * @param {string} value - The value to validate.
   * @param {string} [fieldName='value'] - Human-readable field name used in error messages.
   *
   * @example
   * const v = new Validator('test@email.com', 'email');
   */
  constructor(value: string, fieldName: string = 'value') {
    this.value = value;
    this.fieldName = fieldName;
  }

  /**
   * Validates that the value is not empty or whitespace-only.
   *
   * @returns {this} The validator instance for chaining.
   *
   * @example
   * const errors = new Validator('').isRequired().validate();
   * console.log(errors); // ['value is required']
   */
  isRequired(): this {
    if (!this.value || this.value.trim().length === 0) {
      this.errors.push(`${this.fieldName} is required`);
    }
    return this;
  }

  /**
   * Validates that the value does not exceed the maximum length.
   *
   * @param {number} max - The maximum allowed length.
   * @returns {this} The validator instance for chaining.
   *
   * @example
   * const errors = new Validator('hello world').maxLength(5).validate();
   * console.log(errors); // ['value must be at most 5 characters']
   */
  maxLength(max: number): this {
    if (this.value.length > max) {
      this.errors.push(`${this.fieldName} must be at most ${max} characters`);
    }
    return this;
  }

  /**
   * Validates that the value meets a minimum length requirement.
   *
   * @param {number} min - The minimum required length.
   * @returns {this} The validator instance for chaining.
   *
   * @example
   * const errors = new Validator('hi').minLength(5).validate();
   * console.log(errors); // ['value must be at least 5 characters']
   */
  minLength(min: number): this {
    if (this.value.length < min) {
      this.errors.push(`${this.fieldName} must be at least ${min} characters`);
    }
    return this;
  }

  /**
   * Validates that the value is a properly formatted email address.
   *
   * @returns {this} The validator instance for chaining.
   *
   * @example
   * const errors = new Validator('notanemail').isEmail().validate();
   * console.log(errors); // ['value must be a valid email address']
   */
  isEmail(): this {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(this.value)) {
      this.errors.push(`${this.fieldName} must be a valid email address`);
    }
    return this;
  }

  /**
   * Validates that the value matches the provided regular expression.
   *
   * @param {RegExp} pattern - The regex pattern to test against.
   * @param {string} [message] - Custom error message.
   * @returns {this} The validator instance for chaining.
   *
   * @example
   * const errors = new Validator('abc').matches(/^\d+$/, 'must be digits').validate();
   * console.log(errors); // ['must be digits']
   */
  matches(pattern: RegExp, message?: string): this {
    if (!pattern.test(this.value)) {
      this.errors.push(message ?? `${this.fieldName} does not match the required pattern`);
    }
    return this;
  }

  /**
   * Returns the accumulated validation errors.
   *
   * @returns {string[]} Array of error messages. Empty if validation passed.
   *
   * @example
   * const errors = new Validator('', 'name').isRequired().minLength(3).validate();
   * console.log(errors.length); // 2
   */
  validate(): string[] {
    return [...this.errors];
  }
}
