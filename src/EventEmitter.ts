interface IEventListenerContainer<T_Data> {
    id: number;
    eventId: string;
    listener: TEventListener<T_Data>;
    thisArg: any;
}

export type TEventListener<T_Data> = (data: T_Data) => any;

export class EventEmitter<T_Data> {

    private listenerContainers: { [listenerId: number]: IEventListenerContainer<T_Data>; } = {};
    private eventIdToListenersMap: { [eventId: string]: IEventListenerContainer<T_Data>[]; } = {};

    private nextListenerId = 0;

    public on(eventId: string, listener: TEventListener<T_Data>, thisArg?: any): number {
        if (!this.eventIdToListenersMap[eventId]) this.eventIdToListenersMap[eventId] = [];

        const id = this.nextListenerId++
        const container = {
            id,
            listener,
            thisArg,
            eventId,
        };

        this.eventIdToListenersMap[eventId].push(container);
        this.listenerContainers[id] = container;

        return id;
    }

    public off(listenerId: number) {
        const listener = this.listenerContainers[listenerId];

        if (!listener) throw new Error(`There is no listener with id "${listenerId}"`);

        const listeners = this.eventIdToListenersMap[listener.eventId]

        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);

        delete this.listenerContainers[listenerId];
    }

    public emit(eventId: string, data: T_Data) {
        const listeners = this.eventIdToListenersMap[eventId];
        if (!listeners) return;

        listeners
            .forEach(({ listener, thisArg }) => {
                listener.call(thisArg, data);
            });
    }

    public clear() {
        this.listenerContainers = {};
        this.eventIdToListenersMap = {};
    }
}
