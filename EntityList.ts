import { EventEmitter, TListenerFn } from "./src/EventEmitter";

interface IEntityContainer<T_Entity> { entity: T_Entity; }

export enum EEntityListEventTypes {
    set = "set",
    unset = "unset",
    detach = "detach",
};

export type TEntityListPipeHandler<T_SourceEntity, T_MappedEntity = T_SourceEntity> = (entity: T_SourceEntity) => boolean | T_MappedEntity;

export class EntityList<T_Entity = { [key: string]: any; }> {
    public length = 0;
    public modifiedDate = 0;

    private entities: T_Entity[];
    private renderedDate = 0;

    private entityContainers: IEntityContainer<T_Entity>[] = [];
    private entityContainersMap: { [entityId: string]: IEntityContainer<T_Entity>; } = {};

    private idKey: string;
    private nextEntityId = 0;

    private eventEmitter = new EventEmitter<T_Entity>();
    private parent: EntityList<T_Entity> = null;
    private parentSetListenerId: number = null;
    private parentUnsetListenerId: number = null;
    private pipeHandler: TEntityListPipeHandler<T_Entity> = null;

    constructor(idKey: string = "id") {
        this.idKey = idKey;

        this.updateLastModifiedDate();
    }

    /**
     * Get an entity by id
     */
    public get(entity: string | any): T_Entity | undefined {
        return this.getById(typeof entity === "string" ? entity : this.findId(entity));
    }

    public has(entity: string | any) {
        return !!this.get(entity);
    }

    public set(entityData: any): T_Entity {
        return this.parent ? this.parent.set(entityData) : this.setLocal(entityData) as any;
    }

    public unset(entity: string | any): T_Entity | undefined {
        return this.parent ? this.parent.unset(entity) : this.unsetLocal(entity) as any;
    }

    /**
     * The idea with entityData and entity is that entityData could not have id but entity always does.
     */
    public setLocal(entityData: any): T_Entity {
        const foundId = this.findId(entityData);
        const entityId = foundId ? foundId : this.generateId();
        const isNew = !this.entityContainersMap[entityId];
        const container = this.entityContainersMap[entityId] || (this.entityContainersMap[entityId] = { entity: null });

        const entity = {
            ...entityData,
            [this.idKey]: entityId,
        } as T_Entity;

        container.entity = entity;

        // if no id passed - create new entity
        if (isNew) {
            this.entityContainers.push(container);
            this.length += 1;
        }

        this.updateLastModifiedDate();
        this.eventEmitter.emit(EEntityListEventTypes.set, entity);

        return entity;
    }

    /**
     * Remove an entity by entityId
     */
    public unsetLocal(entity: string | any): T_Entity | undefined {
        const foundEntity = this.unsetById(typeof entity === "string" ? entity : this.findId(entity));

        if (!foundEntity) return;

        this.updateLastModifiedDate();
        this.eventEmitter.emit(EEntityListEventTypes.unset, foundEntity);

        return foundEntity;
    }

    public pipe(pipeHandler: TEntityListPipeHandler<T_Entity>): EntityList<T_Entity> {
        const el = new EntityList<T_Entity>(this.idKey);
        el.pipeFrom(this as any, pipeHandler);
        return el as any;
    }
    public pipeFrom(parent: EntityList<T_Entity>, pipeHandler?: TEntityListPipeHandler<T_Entity>) {
        this.parent = parent;
        this.pipeHandler = pipeHandler;

        this.parentSetListenerId = parent.on(EEntityListEventTypes.set, this.onParentSet, this);
        this.parentUnsetListenerId = parent.on(EEntityListEventTypes.unset, this.onParentUnset, this);
    }
    public clearPipe() {
        this.parent.off(this.parentSetListenerId);
        this.parent.off(this.parentUnsetListenerId);
        this.parent = null;
        this.pipeHandler = null;
    }

    public on(event: EEntityListEventTypes, fn: TListenerFn<T_Entity>, context?: any) {
        return this.eventEmitter.on(event, fn, context);
    }
    public off(listenerId: number): void {
        this.eventEmitter.off(listenerId);
    }

    public toArray() {
        if (this.renderedDate < this.modifiedDate) this.render();
        return this.entities;
    }

    private updateLastModifiedDate() {
        this.modifiedDate = Date.now();
    }
    private render() {
        this.entities = this.entityContainers.map(container => container.entity);
        this.renderedDate = Date.now();
    }
    private onParentSet(parentEntity: T_Entity) {
        const result = this.pipeHandler ? this.pipeHandler(parentEntity) : true;

        if (!result) return;

        const entity = result instanceof Object ? result : parentEntity;
        this.setLocal(entity);
    }
    private onParentUnset(parentEntity: T_Entity) {
        if (!this.has(parentEntity) || (this.pipeHandler && !this.pipeHandler(parentEntity))) return;

        this.unsetLocal(parentEntity);
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
