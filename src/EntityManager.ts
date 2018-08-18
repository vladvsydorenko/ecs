export interface IEntity { 
    readonly id: string;
    readonly [key: string]: any;
}
export interface IEntityData { 
    readonly id?: string;
    readonly [key: string]: any;
};

export type TEntityManagerListenerFn<T extends IEntity> = (entity: T) => any;

export enum EEntityManagerEventTypes {
    set = "set",
    unset = "unset",
};

interface IEntityManagerListener<T extends IEntity> {
    id: number,
    fn: TEntityManagerListenerFn<T>;
    context: any; // fn's execution context
}

export class EntityManager<T extends IEntity = IEntity> {

    public length = 0;
    public lastUpdated: number;

    private entities: { [id: string]: T };
    private listeners: { [id: string]: IEntityManagerListener<T>[] } = {};
    
    private nextEntityId = 0;
    private nextListenerId = 0;

    constructor(entities: { [id: string]: T } = {}) {
        this.entities = entities;
        this.lastUpdated = Date.now();
    }

    public set(data: IEntityData): T {
        const id = data.id !== undefined ? data.id : `entity_${this.nextEntityId++}`;
        const entity = this.entities[id] = Object.freeze({
            ...data,
            id,
        }) as T;
        this.length = Object.keys(this.entities).length;
        this.lastUpdated = Date.now();
        this.notify(EEntityManagerEventTypes.set, entity);
        return entity;
    }

    public unset(entity: T) {
        if (!this.entities[entity.id]) throw new Error(`Attempt to unset not existed entity by id "${entity.id}"`);
        delete this.entities[entity.id];
        this.length = Object.keys(this.entities).length;
        this.lastUpdated = Date.now();
        this.notify(EEntityManagerEventTypes.unset, entity);
    }

    public on(event: EEntityManagerEventTypes, fn: TEntityManagerListenerFn<T>, context?: any): number {
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
        return Object.keys(this.entities).map(key => this.entities[key]);
    }

    public forEach(fn: (value: T, index: number, arr: T[]) => any) {
        this.toArray().forEach(fn);
    }

    public filter(fn: (value: T, index: number, arr: T[]) => any): T[] {
        return this.toArray().filter(fn);
    }

    public find(fn: (value: T, index: number, arr: T[]) => any): T {
        return this.toArray().find(fn);
    }

    public some(fn: (value: T, index: number, arr: T[]) => any): boolean {
        return this.toArray().some(fn);
    }

    public every(fn: (value: T, index: number, arr: T[]) => any): boolean {
        return this.toArray().every(fn);
    }

    private notify(event: EEntityManagerEventTypes, entity: T) {
        const listeners = this.listeners[event];
        if (!listeners) return;
        listeners.forEach(listener => {
            listener.context ? listener.fn.call(listener.context, entity) : listener.fn(entity);
        });
    }
}
