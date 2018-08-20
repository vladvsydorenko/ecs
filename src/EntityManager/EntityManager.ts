import { EEntityManagerEventTypes, TEntityManagerListenerFn } from "./types";

interface IEntityManagerListener<T> {
    id: string;
    fn: TEntityManagerListenerFn<T>;
    context: any;
}

export class EntityManager<T> {

    private nextListenerId = 0;
    private listeners: { [event: string]: IEntityManagerListener<T>[]; } = {};
    private listenersMap: { [listenerdId: string]: string; } = {};

    public on(event: EEntityManagerEventTypes, fn: TEntityManagerListenerFn<T>, context?: any): string {
        const id = `listener_${this.nextListenerId++}`;
        if (!this.listeners[event]) this.listeners[event] = [];
        const listeners = this.listeners[event];
        listeners.push({
            id,
            fn,
            context,
        });
        this.listenersMap[id] = event;
        return id;
    }

    public off(listenerId: string) {
        const event = this.listenersMap[listenerId];
        if (!event) return;
        
        const listeners = this.listeners[event];
        if (!listeners) return;

        let index = -1;
        listeners.some((listener, i) => {
            if (listener.id === listenerId) {
                index = i;
                return true;
            }
        });

        if (index > -1) {
            listeners.splice(index, 1);
            delete this.listenersMap[listenerId];
        }
    }

    public notify(event: EEntityManagerEventTypes, entity: Readonly<T>) {
        const listeners = this.listeners[event];
        if (!listeners) return;
        listeners.forEach(listener => {
            listener.context ? 
                listener.fn.call(listener.context, entity) : listener.fn(entity);
        });
    }

}
