import { EventEmitter, TListenerFn } from "./EventEmitter";

interface IEntityContainer<T_Entity> { entity: T_Entity; }

export enum EEntityListEventTypes {
    set = "set",
    unset = "unset",
};

export class EntityList<T_Entity = { [key: string]: any; }> {
    public length = 0;

    private entityContainers: IEntityContainer<T_Entity>[] = [];
    private entityContainersMap: { [entityId: string]: IEntityContainer<T_Entity>; } = {};

    private idKey: string;
    private nextEntityId = 0;

    private eventEmitter = new EventEmitter<T_Entity>();

    constructor(idKey: string = "id") {
        this.idKey = idKey;
    }

    /**
     * The idea with entityData and entity is that entityData could not have id but entity always does.
     */
    public set(entityData: any): T_Entity {
        const foundId = this.findId(entityData);
        const entityId = foundId ? foundId : this.generateId();
        const container = this.entityContainersMap[entityId] || (this.entityContainersMap[entityId] = { entity: null });

        const entity = {
            ...entityData,
            [this.idKey]: entityId,
        } as T_Entity;

        container.entity = entity;

        // if no id passed - create new entity
        if (!foundId) {
            this.entityContainers.push(container);
            this.length += 1;
        }

        this.eventEmitter.emit(EEntityListEventTypes.set, entity);

        return entity;
    }

    /**
     * Get an entity by id
     */
    public get(entity: string | any): T_Entity | undefined {
        return this.getById(typeof entity === "string" ? entity : this.findId(entity));
    }

    /**
     * Remove an entity by entityId
     */
    public unset(entity: string | any): T_Entity | undefined {
        const result = this.unsetById(typeof entity === "string" ? entity : this.findId(entity));
        this.eventEmitter.emit(EEntityListEventTypes.unset, entity);
        return result;
    }

    public on(event: EEntityListEventTypes, fn: TListenerFn<T_Entity>, context?: any) {
        return this.eventEmitter.on(event, fn, context);
    }
    public off(listenerId: number): void {
        this.eventEmitter.off(listenerId);
    }

    private getById(entityId: string): T_Entity | undefined {
        const container = this.entityContainersMap[entityId];
        return container ? container.entity : undefined;
    }
    private unsetById(entityId: string): T_Entity | undefined {
        const container = this.entityContainersMap[entityId];
        if (!container) return;

        const index = this.entityContainers.indexOf(container);
        if (index === -1) return;

        this.entityContainers.splice(index, 1);
        delete this.entityContainersMap[entityId];
        this.length -= 1;

        return container.entity;
    }
    private generateId(): string {
        return `entity_${this.nextEntityId++}`;
    }
    private findId(entityData: any): string | undefined {
        const passedId = entityData[this.idKey];
        return typeof(passedId) === "string" ? passedId : undefined;
    }
}
