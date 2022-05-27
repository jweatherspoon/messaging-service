import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export default {
  port: process.env.PORT || 7500,
  messageBus: {
    connectionString: process.env.BROKER_CONNECTION_STRING || 'amqp://localhost:5672'
  }
}