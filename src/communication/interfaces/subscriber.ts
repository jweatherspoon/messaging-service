import { Error } from '../../models/error';

export type Callback = (data: any, error: Error) => void;

export interface Subscriber {
  subscribe(channel: string, callback: Callback): void;
  
  unsubscribe(channel: string): void;

  unsubscribeAll(): void;
}