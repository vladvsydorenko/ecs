import { EEntityManagerEventTypes, TEntityManagerListenerFn, IEntity, TEntityManagerParentFilter } from "./types";

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

    private parent: EntityManager<T, U> = null;
    private parentFilter: TEntityManagerParentFilter<T> = null;
    private parentSetListenerId: string;
    private parentUnsetListenerId: string;

    public set(data: U | T): Readonly<T> {
        if (this.parent) return this.parent.set(data);
        return this.setInSelf(data);
    }

    public setMany(datas: (U | T)[]) {
        datas.forEach(data => this.set(data));
    }

    public unset(id: string | T): Readonly<T> | undefined {
        if (this.parent) return this.parent.unset(id);
        return this.unsetInSelf(id);
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

    public connect(parent: EntityManager<T, U>, filter: TEntityManagerParentFilter<T> = null) {
        this.parent = parent;
        this.parentFilter = filter;
        this.parentSetListenerId = parent.on(EEntityManagerEventTypes.set, this.onParentSet, this);
        this.parentUnsetListenerId = parent.on(EEntityManagerEventTypes.unset, this.onParentUnset, this);
    }

    public disconnect() {
        if (!this.parent) return;
        
        this.parent.off(this.parentSetListenerId);
        this.parent.off(this.parentUnsetListenerId);

        this.parent = null;
        this.parentSetListenerId = null;
        this.parentUnsetListenerId = null;
    }

    public pipe(filter: TEntityManagerParentFilter<T> = null) {
        const em = new EntityManager();
        const entities = filter ? this.entities.filter(entity => filter(entity)) : this.entities;
        em.setMany(entities as any);
        em.connect(this);
        return em;
    }

    private onParentSet(entity: Readonly<T>) {
        if (!this.parentFilter || this.parentFilter(entity)) this.setInSelf(entity);
    }

    private onParentUnset(entity: Readonly<T>) {
        if (!this.parentFilter || this.parentFilter(entity)) this.unsetInSelf(entity);
    }

    private render() {
        this.entities = Object.freeze(this.entityContainers.map(container => container.entity));
    }

    // set in itselve's scope, not in parent
    private setInSelf(data: U | T): Readonly<T> {
        const { entityIdKey } = this;
        const id = typeof data[entityIdKey] === "string" ? data[entityIdKey] : `entity_${this.nextEntityId++}`;
        const isNew = !this.entityContainersMap[id];
        const entity = {
            ...(data as any),
            [entityIdKey]: id,
        };

        if (isNew) {
            this.entityContainersMap[id] = this.entityContainersMap[id] || (this.entityContainersMap[id] = { entity: null });
            this.entityContainers.push(this.entityContainersMap[id]);
            this.length += 1;
        }

        this.entityContainersMap[id].entity = entity;
        this.render();
        this.notify(EEntityManagerEventTypes.set, entity);

        return entity;
    }

    // set in itselve's scope, not in parent
    private unsetInSelf(id: string | T): Readonly<T> | undefined {
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

}
