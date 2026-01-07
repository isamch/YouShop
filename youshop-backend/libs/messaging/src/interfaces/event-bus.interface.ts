import { BaseEvent } from './base-event.interface';

/**
 * Event Bus Interface
 * 
 * @description
 * Interface for event bus implementation
 */
export interface EventBus {
  /**
   * Emit an event
   */
  emit<T extends BaseEvent>(event: T): Promise<void>;

  /**
   * Subscribe to events
   */
  subscribe<T extends BaseEvent>(
    eventType: string,
    handler: (event: T) => Promise<void>
  ): void;

  /**
   * Unsubscribe from events
   */
  unsubscribe(eventType: string, handler: Function): void;
}

/**
 * Message Client Interface
 * 
 * @description
 * Interface for message client (for request-response patterns)
 */
export interface MessageClient {
  /**
   * Send a message and wait for response
   */
  send<TResult = any, TInput = any>(
    pattern: string,
    data: TInput
  ): Promise<TResult>;

  /**
   * Emit a message without waiting for response
   */
  emit<TInput = any>(pattern: string, data: TInput): Promise<void>;
}