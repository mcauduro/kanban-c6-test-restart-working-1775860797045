/**
 * Represents an HTTP request built via the Builder pattern.
 */
export interface HttpRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  timeout: number;
  retries: number;
}

/**
 * Builder class for constructing HttpRequest objects step by step.
 * Provides a fluent interface for setting individual request properties.
 *
 * @example
 * const request = new HttpRequestBuilder()
 *   .setMethod('POST')
 *   .setUrl('https://api.example.com/data')
 *   .setHeader('Content-Type', 'application/json')
 *   .setBody(JSON.stringify({ key: 'value' }))
 *   .build();
 */
export class HttpRequestBuilder {
  private method: string = 'GET';
  private url: string = '';
  private headers: Record<string, string> = {};
  private body?: string;
  private timeout: number = 30000;
  private retries: number = 0;

  /**
   * Sets the HTTP method for the request.
   *
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.).
   * @returns {this} The builder instance for chaining.
   *
   * @example
   * const builder = new HttpRequestBuilder().setMethod('DELETE');
   */
  setMethod(method: string): this {
    this.method = method.toUpperCase();
    return this;
  }

  /**
   * Sets the URL for the request.
   *
   * @param {string} url - The full request URL.
   * @returns {this} The builder instance for chaining.
   * @throws {Error} If the URL is empty.
   *
   * @example
   * const builder = new HttpRequestBuilder().setUrl('https://api.example.com');
   */
  setUrl(url: string): this {
    if (!url) throw new Error('URL cannot be empty');
    this.url = url;
    return this;
  }

  /**
   * Adds or replaces a request header.
   *
   * @param {string} name - Header name.
   * @param {string} value - Header value.
   * @returns {this} The builder instance for chaining.
   *
   * @example
   * const builder = new HttpRequestBuilder()
   *   .setHeader('Authorization', 'Bearer token123');
   */
  setHeader(name: string, value: string): this {
    this.headers[name] = value;
    return this;
  }

  /**
   * Sets the request body (for POST/PUT/PATCH).
   *
   * @param {string} body - The serialized request body.
   * @returns {this} The builder instance for chaining.
   *
   * @example
   * const builder = new HttpRequestBuilder()
   *   .setBody(JSON.stringify({ userId: 1 }));
   */
  setBody(body: string): this {
    this.body = body;
    return this;
  }

  /**
   * Sets the request timeout in milliseconds.
   *
   * @param {number} ms - Timeout in milliseconds. Defaults to 30000.
   * @returns {this} The builder instance for chaining.
   * @throws {Error} If ms is not a positive number.
   *
   * @example
   * const builder = new HttpRequestBuilder().setTimeout(5000);
   */
  setTimeout(ms: number): this {
    if (ms <= 0) throw new Error('Timeout must be positive');
    this.timeout = ms;
    return this;
  }

  /**
   * Sets the number of automatic retries on failure.
   *
   * @param {number} count - Number of retries (0 = no retries).
   * @returns {this} The builder instance for chaining.
   *
   * @example
   * const builder = new HttpRequestBuilder().setRetries(3);
   */
  setRetries(count: number): this {
    this.retries = Math.max(0, count);
    return this;
  }

  /**
   * Builds and returns the final HttpRequest object.
   *
   * @returns {HttpRequest} The constructed request.
   * @throws {Error} If the URL has not been set.
   *
   * @example
   * const request = new HttpRequestBuilder()
   *   .setUrl('https://api.example.com')
   *   .build();
   */
  build(): HttpRequest {
    if (!this.url) throw new Error('URL is required to build an HttpRequest');
    return {
      method: this.method,
      url: this.url,
      headers: { ...this.headers },
      body: this.body,
      timeout: this.timeout,
      retries: this.retries,
    };
  }
}
