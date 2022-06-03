export interface MQRoutingInfo {
  topic: string;
  routingKeys?: Record<string, string>;
}