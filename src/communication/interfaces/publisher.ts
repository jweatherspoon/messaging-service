export interface Publisher {
  publish(channel: string, data: string): Promise<void>;
}