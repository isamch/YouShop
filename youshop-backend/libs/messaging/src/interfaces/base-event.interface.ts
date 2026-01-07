/**
 * Base Event Interface
 * 
 * @description
 * Base interface for all events in the system
 */
export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: Date;
  source: string;
  version: string;
}

/**
 * Event Handler Interface
 * 
 * @description
 * Interface for event handlers
 */
export interface EventHandler<T extends BaseEvent> {
  handle(event: T): Promise<void>;
}