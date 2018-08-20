import { EEntityManagerEventTypes, TEntityManagerListenerFn, IEntity } from "./types";

interface IEntityManagerListener<T> {
    id: string;
    fn: TEntityManagerListenerFn<T>;
    context: any;
}

interface IEntityManagerEntityContainer<T> {
    entity: Readonly<T>;
}

export class EntityManager<T extends IEntity = IEntity, U extends IEntity = T> {

    public length = 0;

    // rendered array, toArray will return this one
    private entities: ReadonlyArray<Readonly<T>> = [];
    // containers in render order
    private entityContainers: IEntityManagerEntityContainer<T>[] = [];
    // quick access to entity by id
    private entityContainersMap: { [entityId: string]: IEntityManagerEntityContainer<T>; } = {};
    private nextEntityId = 0;
    private entityIdKey = "id";

    // listeners set
    private listeners: { [event: string]: IEntityManagerListener<T>[]; } = {};
    // map listenerId => event name
    private listenersMap: { [listenerdId: string]: string; } = {};
    private nextListenerId = 0;

    public set(data: U): Readonly<T> {
        const { entityIdKey } = this;
        const isNew = typeof data[entityIdKey] !== "string";
        const id = isNew ? `entity_${this.nextEntityId++}` : data[entityIdKey];
        const entity = {
            ...(data as any),
            [entityIdKey]: id,
        };

        if (isNew) {
            this.entityContainersMap[id] = { entity: null };
            this.entityContainers.push(this.entityContainersMap[id]);
            this.length += 1;
        }

        this.entityContainersMap[id].entity = entity;
        this.render();
        this.notify(EEntityManagerEventTypes.set, entity);

        return entity;
    }

    public unset(id: string | T): Readonly<T> | undefined {
        const entityId = typeof id === "string" ? id : id[this.entityIdKey];
        
        const container = this.entityContainersMap[entityId];
        if (!container) return;
        
        const index = this.entityContainers.indexOf(container);
        if (index === -1) return; 
        
        this.entityContainers.splice(index, 1);
        delete this.entityContainersMap[entityId];
        this.length -= 1;
        this.render();
        this.notify(EEntityManagerEventTypes.unset, container.entity);
        
        return container.entity;
    }

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

    public toArray() {
        return this.entities;
    }

    private render() {
        this.entities = Object.freeze(this.entityContainers.map(container => container.entity));
    }

}
