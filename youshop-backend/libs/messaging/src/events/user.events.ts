import { BaseEvent } from '../interfaces/base-event.interface';

/**
 * User Created Event
 * 
 * @description
 * Emitted when a new user is created
 */
export interface UserCreatedEvent extends BaseEvent {
  eventType: 'user.created';
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
}

/**
 * User Updated Event
 * 
 * @description
 * Emitted when user information is updated
 */
export interface UserUpdatedEvent extends BaseEvent {
  eventType: 'user.updated';
  data: {
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
  };
}

/**
 * User Deleted Event
 * 
 * @description
 * Emitted when a user is deleted
 */
export interface UserDeletedEvent extends BaseEvent {
  eventType: 'user.deleted';
  data: {
    userId: string;
    email: string;
  };
}