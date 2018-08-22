interface IEventListenerContainer<T_Data> {
    id: Symbol;
    eventId: string;
    listener: TEventListener<T_Data>;
    thisArg: any;
}

export type TEventListener<T_Data> = (data: T_Data) => any;

export class EventEmitter<T_Data> {

    private listenerContainers: { [eventId: string]: IEventListenerContainer<T_Data>[]; } = {};
    private sortedListenerContainers: { [listenerId: string]: IEventListenerContainer<T_Data>; } = {};
    private nextListenerId = 0;

    public on(eventId: string, listener: TEventListener<T_Data>, thisArg?: any): Symbol {
        if (!this.listenerContainers[eventId]) this.listenerContainers[eventId] = [];

        const id = Symbol();
        const container = {
            id,
            listener,
            thisArg,
            eventId,
        };

        this.listenerContainers[eventId].push(container);
        this.sortedListenerContainers[id as any] = container;

        return id;
    }

    public off(listenerId: Symbol) {
        const listener = this.sortedListenerContainers[listenerId as any];

        if (!listener) return;

        const listeners = this.listenerContainers[listener.eventId]

        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);

        delete this.sortedListenerContainers[listenerId as any];
    }

    public emit(eventId: string, data: T_Data) {
        const listeners = this.listenerContainers[eventId];
        if (!listeners) return;

        listeners
            .forEach(({ listener, thisArg }) => {
                listener.call(thisArg, data);
            });
    }

    public clear() {
        this.sortedListenerContainers = {};
        this.listenerContainers = {};
    }
}
