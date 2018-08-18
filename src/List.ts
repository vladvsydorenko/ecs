export interface IListItem { readonly id: string; }
export interface IListItemData { 
    readonly id?: string;
    readonly [key: string]: any;
};

export type IListListenerFn<T extends IListItem> = (item: T) => any;

export enum EListEventTypes {
    set = "set",
    unset = "unset",
};

interface IListListener<T extends IListItem> {
    id: number,
    fn: IListListenerFn<T>;
    context: any; // fn's execution context
}

export class List<T extends IListItem = IListItem> {

    public length = 0;

    private items: { [id: string]: T } = {};
    private listeners: { [id: string]: IListListener<T>[] } = {};
    
    private nextItemId = 0;
    private nextListenerId = 0;

    public set(data: IListItemData): T {
        const id = data.id !== undefined ? data.id : `item_${this.nextItemId++}`;
        const item = this.items[id] = Object.freeze({
            ...data,
            id,
        }) as T;
        this.length = Object.keys(this.items).length;
        this.notify(EListEventTypes.set, item);
        return item;
    }

    public unset(item: T) {
        if (!this.items[item.id]) throw new Error(`Attempt to unset not existed item by id "${item.id}"`);
        delete this.items[item.id];
        this.length = Object.keys(this.items).length;
        this.notify(EListEventTypes.unset, item);
    }

    public on(event: EListEventTypes, fn: IListListenerFn<T>, context?: any): number {
        const id = this.nextListenerId++;
        const listeners = this.listeners[event] || (this.listeners[event] = []);
        listeners.push({
            id,
            fn,
            context
        });
        return id;
    }
    
    public off(id: number) {
        Object.keys(this.listeners).forEach(event => {
            let index;
            this.listeners[event].some((listener, i) => {
                if (listener.id !== id) return;
                index = i;
                return true;
            });
            if (index === undefined) return;
            this.listeners[event].splice(index, 1);
            if (this.listeners[event].length === 0) delete this.listeners[event];
        });
    }
    
    public toArray(): T[] {
        return Object.keys(this.items).map(key => this.items[key]);
    }

    private notify(event: EListEventTypes, item: T) {
        const listeners = this.listeners[event];
        if (!listeners) return;
        listeners.forEach(listener => listener.context ? listener.fn.call(listener.context, item) : listener.fn(item));
    }
}
