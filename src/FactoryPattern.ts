/**
 * Supported notification channels.
 */
export type NotificationChannel = 'email' | 'sms' | 'push';

/**
 * Common interface for all notification providers.
 */
export interface INotificationProvider {
  send(to: string, message: string): Promise<void>;
  channel: NotificationChannel;
}

/**
 * Email notification provider.
 */
class EmailProvider implements INotificationProvider {
  readonly channel: NotificationChannel = 'email';

  async send(to: string, message: string): Promise<void> {
    console.log(`[Email] To: ${to} | Message: ${message}`);
  }
}

/**
 * SMS notification provider.
 */
class SmsProvider implements INotificationProvider {
  readonly channel: NotificationChannel = 'sms';

  async send(to: string, message: string): Promise<void> {
    console.log(`[SMS] To: ${to} | Message: ${message}`);
  }
}

/**
 * Push notification provider.
 */
class PushProvider implements INotificationProvider {
  readonly channel: NotificationChannel = 'push';

  async send(to: string, message: string): Promise<void> {
    console.log(`[Push] To: ${to} | Message: ${message}`);
  }
}

/**
 * Factory class that creates notification providers based on the channel type.
 * Encapsulates the instantiation logic and makes it easy to extend with new channels.
 *
 * @example
 * const factory = new NotificationFactory();
 * const provider = factory.create('email');
 * await provider.send('user@example.com', 'Hello!');
 */
export class NotificationFactory {
  /**
   * Creates and returns a notification provider for the given channel.
   *
   * @param {NotificationChannel} channel - The notification channel to use.
   * @returns {INotificationProvider} An instance of the appropriate provider.
   * @throws {Error} If the channel is not supported.
   *
   * @example
   * const factory = new NotificationFactory();
   * const sms = factory.create('sms');
   */
  create(channel: NotificationChannel): INotificationProvider {
    switch (channel) {
      case 'email': return new EmailProvider();
      case 'sms': return new SmsProvider();
      case 'push': return new PushProvider();
      default: throw new Error(`Unsupported channel: ${channel}`);
    }
  }

  /**
   * Returns all supported notification channels.
   *
   * @returns {NotificationChannel[]} Array of supported channel names.
   *
   * @example
   * const factory = new NotificationFactory();
   * console.log(factory.supportedChannels()); // ['email', 'sms', 'push']
   */
  supportedChannels(): NotificationChannel[] {
    return ['email', 'sms', 'push'];
  }

  /**
   * Sends a notification via all available channels simultaneously.
   *
   * @param {string} to - The recipient identifier (email, phone, device token).
   * @param {string} message - The notification message.
   * @returns {Promise<void>} Resolves when all providers have sent.
   *
   * @example
   * const factory = new NotificationFactory();
   * await factory.broadcast('user123', 'System alert: maintenance window');
   */
  async broadcast(to: string, message: string): Promise<void> {
    const providers = this.supportedChannels().map(ch => this.create(ch));
    await Promise.all(providers.map(p => p.send(to, message)));
  }

  /**
   * Creates a provider and immediately sends a single message.
   *
   * @param {NotificationChannel} channel - The notification channel.
   * @param {string} to - The recipient.
   * @param {string} message - The message content.
   * @returns {Promise<void>} Resolves when sent.
   *
   * @example
   * const factory = new NotificationFactory();
   * await factory.sendVia('push', 'device-token-xyz', 'You have a new message');
   */
  async sendVia(channel: NotificationChannel, to: string, message: string): Promise<void> {
    const provider = this.create(channel);
    await provider.send(to, message);
  }

  /**
   * Checks if a given channel string is a valid supported channel.
   *
   * @param {string} channel - The channel name to validate.
   * @returns {boolean} True if the channel is supported.
   *
   * @example
   * const factory = new NotificationFactory();
   * console.log(factory.isValidChannel('email')); // true
   * console.log(factory.isValidChannel('fax'));   // false
   */
  isValidChannel(channel: string): channel is NotificationChannel {
    return this.supportedChannels().includes(channel as NotificationChannel);
  }
}
