import { createLogger, transports } from "winston";
import LokiTransport from "winston-loki";
const options = {
  transports: [
    new LokiTransport({
      labels: { app: "Twitter Backend" },
      host: "http://127.0.0.1:9092",
    }),
  ],
};
export const logger = createLogger(options);
