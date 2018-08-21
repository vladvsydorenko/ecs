interface IListener<T> {
    id: number;
    fn: TListenerFn<T>;
    context: any;
}

interface IlistenerContainer<T> {
    eventType: string;
    listener: IListener<T>;
}

export type TListenerFn<T_Data> = (data: T_Data) => any;

export class EventEmitter<T_Data = any> {

    private listeners: { [eventType: string]: IListener<T_Data>[]; } = {};
    private listenersMap: { [listenerId: string]: IlistenerContainer<T_Data> } = {}; // `listener id => event name` map
    private nextListenerId = 0;

    public on(eventType: string, fn: TListenerFn<T_Data>, context?: any): number {
        const listeners = this.listeners[eventType] || (this.listeners[eventType] = []);

        const id = this.nextListenerId;
        this.nextListenerId += 1;

        const listener = { id, fn, context }
        listeners.push(listener);
        this.listenersMap[id] = {
            eventType,
            listener
        };

        return id;
    }

    public off(listenerId: number): void {
        const meta = this.listenersMap[listenerId];

        if (!meta) return;

        const listeners = this.listeners[meta.eventType];
        const index = listeners.indexOf(meta.listener);

        if (index === -1) return;

        listeners.splice(index, 1);
        delete this.listenersMap[listenerId];

        if (listeners.length === 0) delete this.listeners[meta.eventType];
    }

    public emit(event: string, data: T_Data): void {
        const listeners = this.listeners[event];

        if (!listeners) return;

        listeners.forEach(({ fn, context }) => fn.call(context, data));
    }

}
