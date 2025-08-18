import { AppEvents } from './AppEvents';

type Handler<P> = [P] extends [void] ? () => void : (payload: P) => void | Promise<void>;

class EventBus {
  private static _instance: EventBus | null = null;

  // Map of event name -> set of handlers
  private _handlers = new Map<keyof AppEvents, Set<Handler<AppEvents[keyof AppEvents]>>>();

  private constructor() {
    this._handlers = new Map();
  }

  static get instance(): EventBus {
    if (!this._instance) this._instance = new EventBus();
    return this._instance;
  }

  on<K extends keyof AppEvents>(type: K, handler: Handler<AppEvents[K]>): () => void {
    let set = this._handlers.get(type);
    if (!set) {
      set = new Set();
      this._handlers.set(type, set);
    }
    set.add(handler as Handler<any>);
    return () => this.off(type, handler);
  }

  off<K extends keyof AppEvents>(type: K, handler: Handler<AppEvents[K]>): void {
    const set = this._handlers.get(type);
    if (!set) return;
    set.delete(handler as Handler<any>);
    if (set.size === 0) this._handlers.delete(type);
  }

  emit<K extends keyof AppEvents>(type: K, ...args: AppEvents[K] extends void ? [] : [AppEvents[K]]): void {
    const set = this._handlers.get(type);
    if (!set || set.size === 0) return;
    for (const fn of [...set] as Handler<AppEvents[K]>[]) {
      queueMicrotask(() => {
        try {
          // @ts-expect-error — args is [] for void, [payload] otherwise
          fn(...args);
        } catch (err) {
          // TODO: Log this
        }
      });
    }
  }

  listenerCount<K extends keyof AppEvents>(type: K): number {
    return this._handlers.get(type)?.size ?? 0;
  }

  clear(): void {
    this._handlers.clear();
  }
}

export default EventBus.instance;
