export interface Publisher {
  publish(data: string): Promise<void>;
}