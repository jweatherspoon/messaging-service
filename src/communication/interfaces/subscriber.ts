import { Error } from '../../models/error';

export type Callback = (data: any, error: Error) => void;

export interface Subscriber {
  subscribe(channel: string, callback: Callback): Promise<void>;
  
  unsubscribe(channel: string): Promise<void>;

  unsubscribeAll(): Promise<void>;
}