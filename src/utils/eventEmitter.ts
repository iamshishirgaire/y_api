import type { EventPayloads } from "./eventTypes";

type EventHandler<T> = (payload: T) => void;

class EventEmitter<Events extends Record<string, unknown>> {
  private events: { [K in keyof Events]?: EventHandler<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]?.push(handler);
  }

  off<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>
  ): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event]?.filter((h) => h !== handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    if (!this.events[event]) return;

    for (const handler of this.events[event]?.slice() ?? []) {
      handler(payload);
    }
  }
}

export default new EventEmitter<EventPayloads>();
