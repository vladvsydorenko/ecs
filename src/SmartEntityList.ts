import { EventEmitter, TListenerFn } from "./EventEmitter";

interface IEntityContainer<T_Entity> { entity: T_Entity; }

export enum EEntityListEventTypes {
    set = "set",
    unset = "unset",
    free = "free",
};

export type TEntityListSetHandler<T_Entity> = (data: any | T_Entity, el: EntityList<T_Entity>) => T_Entity;
export type TEntityListUnsetHandler<T_Entity> = (entityId: string | T_Entity, el: EntityList<T_Entity>) => T_Entity | undefined;;

export interface IEntityListOptions<T_Entity> {
    setHandler?: TEntityListSetHandler<T_Entity>;
    unsetHandler?: TEntityListUnsetHandler<T_Entity>;
}

export class EntityList<T_Entity = { [key: string]: any; }> {
    public length = 0;
    public modifyTime = 0;

    private eventEmitter = new EventEmitter<T_Entity>();
    private nextEntityId = 0;
    private idKey = "id";
    private entityContainers: IEntityContainer<T_Entity>[] = [];
    private entityContainersMap: { [id: string]: IEntityContainer<T_Entity>; } = {};

    private setHandler: TEntityListSetHandler<T_Entity>;
    private unsetHandler: TEntityListUnsetHandler<T_Entity>;

    constructor(options: IEntityListOptions<T_Entity>) {
        this.setHandler = options.setHandler || (data => this.defaultSetHandler(data));
        this.unsetHandler = options.unsetHandler || (data => this.defaultUnsetHandler(data));

        this.updateModifyTime();
    }

    public set(data: any | T_Entity): T_Entity | undefined {
        return this.setHandler(data, this);
    }

    public unset(entity: string | T_Entity): T_Entity | undefined {
        return this.unsetHandler(entity, this);
    }

    public free(entity: T_Entity) {
        this.eventEmitter.emit(EEntityListEventTypes.free, entity);
    }

    public on(eventType: EEntityListEventTypes, fn: TListenerFn<T_Entity>, context?: any): number {
        return this.eventEmitter.on(eventType, fn, context);
    }

    public off(listenerId: number) {
        return this.eventEmitter.off(listenerId);
    }

    private generateId(): string {
        return `entity_${this.nextEntityId++}`;
    }
    private findId(data: any): string | undefined {
        const passedId = data[this.idKey];
        return typeof(passedId) === "string" ? passedId : undefined;
    }
    private defaultSetHandler(data: any) {
        const foundId = this.findId(data);
        const entityId = foundId ? foundId : this.generateId();
        const isNew = !this.entityContainersMap[entityId];
        const container = this.entityContainersMap[entityId] || (this.entityContainersMap[entityId] = { entity: null });

        const entity = {
            ...data,
            [this.idKey]: entityId,
        } as T_Entity;

        container.entity = entity;

        // if no id passed - create new entity
        if (isNew) {
            this.entityContainers.push(container);
            this.length += 1;
        }

        this.updateModifyTime();
        this.eventEmitter.emit(EEntityListEventTypes.set, entity);

        return entity;
    }

    private defaultUnsetHandler(data: any) {
        const entityId = typeof data === "string" ? data : this.findId(data);
        const container = this.entityContainersMap[entityId];
        if (!container) return;

        const index = this.entityContainers.indexOf(container);
        if (index === -1) return;

        this.entityContainers.splice(index, 1);
        delete this.entityContainersMap[entityId];
        this.length -= 1;

        this.updateModifyTime();
        this.eventEmitter.emit(EEntityListEventTypes.unset, container.entity);

        return container.entity;
    }

    private updateModifyTime() {
        this.modifyTime = Date.now();
    }
}
