import { createBunWebSocket } from "hono/bun";
import type { WSContext } from "hono/ws";
import type { EventPayloads } from "../utils/eventTypes";
import eventEmitter from "../utils/eventEmitter";
import pubSubService from "./pubSub.service";
const { websocket, upgradeWebSocket } = createBunWebSocket();

const clients = new Map<string, WSContext>();

const socketHandler = upgradeWebSocket((c) => {
  const userId = c.get("userId") as string;

  return {
    onMessage(event, ws) {
      console.log(`Message from client: ${event.data}`);
      ws.send("Hello from server!");
      const data = JSON.parse(event.data.toString());
      const eventType = data.event as keyof EventPayloads;
      const payload = data.payload;
      if (eventType && payload) {
        eventEmitter.emit(eventType, payload);
      }
    },
    onClose: (evt, ws) => {
      console.log("Connection closed", evt);
    },
    onOpen(evt, ws) {
      console.log("Connection closed");
      const id = crypto.randomUUID();
      clients.set(id, ws);
      pubSubService.subscribe(userId, (message) => {
        eventEmitter.emit("message:send", {
          content: message,
          senderId: userId,
          receiverId: userId,
        });
      });
    },
  };
});

export { socketHandler, websocket };
