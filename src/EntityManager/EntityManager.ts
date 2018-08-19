import { IEntityManager } from "./IEntityManager";
import { IEntity } from "./IEntity";
import { EEntityManagerEventTypes, TEntityManagerListenerFn } from "./types";

interface IEntityContainer<T> {
    entity: T;
}

interface IEntityManagerListener<T> {
    id: string;
    fn: TEntityManagerListenerFn<T>;
    context: any;
}

export class EntityManager<T extends IEntity = IEntity, U extends IEntity = T> implements IEntityManager<T, U> {
    
    private containers: IEntityContainer<T>[] = [];
    private containersMap: { [entityId: string]: IEntityContainer<T>; } = {};

    private listeners: { [event: string]: IEntityManagerListener<T>[] } = {};
    private listenersMap: { [listenerId: string]: string; }; // map listenerId -> event name

    private entities: T[];

    private nextEntityId = 0;
    private nextListenerId = 0;

    private idKey: string;

    constructor({ idKey }: { idKey: string } = { idKey: "id" }) {
        this.idKey = idKey;
    }

    public set(data: U): T {
        const isNew = data[this.idKey] === undefined;
        const id = isNew ? `entity_${this.nextEntityId++}` : data[this.idKey];
        const container = this.containersMap[id] || (this.containersMap[id] = { entity: null });
        const entity = {
            ...(data as any),
            [this.idKey]: id,
        };
        container.entity = entity;
        if (isNew) this.containers.push(container);
        this.notify(EEntityManagerEventTypes.set, entity);
        this.render();
        return entity;
    }

    public get(entityId: string | T): T | undefined {
        const id: string = typeof entityId === "string" ? entityId : entityId.id;
        return this.containersMap[id] ? this.containersMap[id].entity : undefined;
    }

    public has(entityId: string): boolean {
        return !!this.containersMap[entityId];
    }

    public unset(entityId: string | T): T | undefined {
        const id = typeof entityId === "string" ? entityId : entityId[this.idKey];
        const container = this.containersMap[id];
        if (!container) return undefined;
        const index = this.containers.indexOf(container);
        if (index > -1) this.containers.splice(index, 1);
        delete this.containersMap[id];
        this.notify(EEntityManagerEventTypes.unset, container.entity);
        this.render();
        return container.entity;
    }

    public toArray() {
        return this.entities;
    }

    public on(event: EEntityManagerEventTypes, fn: TEntityManagerListenerFn<T>, context?: any): string {
        const id = `listener_${this.nextListenerId++}`;
        const listeners = this.listeners[event] || (this.listeners[event] = []);
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

    public attach(parent: IEntityManager<T, U>) {

    }

    public detach() {}

    public filter(fn: (entity: T) => boolean): IEntityManager<T, U> {
        return new EntityManager<T, U>();
    }

    private notify(event: EEntityManagerEventTypes, entity: T) {
        const listeners = this.listeners[event];
        if (!listeners) return;
        listeners.forEach(listener => {
            listener.context ? 
                listener.fn.call(listener.context, entity) : listener.fn(entity);
        });
    }

    private render(): T[] {
        return this.entities = this.containers.map(({ entity }) => entity);
    }

}
