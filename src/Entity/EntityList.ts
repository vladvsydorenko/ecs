import { EventEmitter, TListenerFn } from "../EventEmitter";

interface IEntityContainer<T_EntityType> {
    entity: Readonly<T_EntityType>;
}

export type TEntityFilter<T_EntityType> = (entity: T_EntityType) => boolean;
export type TEntityMap<T_EntityType, T_UnmappedEntityType> = (entity: T_UnmappedEntityType) => T_EntityType;

export interface IEntity {
    [key: string]: any;
}

export interface IEntityListPipeOptions<T_EntityType, T_UnmappedEntityType> {
    filter?: TEntityFilter<T_EntityType>;
    map?: TEntityMap<T_EntityType, T_UnmappedEntityType>;
}

export class EntityList<
    T_EntityType extends IEntity = IEntity,
    T_SetEntityType extends IEntity = T_EntityType,
    T_UnmappedEntityType extends IEntity = T_EntityType
> {

    private idKey = "id";
    private eventEmitter = new EventEmitter<T_EntityType>();

    private entityContainers: IEntityContainer<T_EntityType>[] = [];
    private entityContainersMap: { [entityId: string]: IEntityContainer<T_EntityType> } = {};
    private nextEntityId = 0;

    private parent: EntityList<T_EntityType, T_SetEntityType, T_UnmappedEntityType>;
    private filter: (entity: T_EntityType) => boolean;
    private map: TEntityMap<T_EntityType, T_UnmappedEntityType>;

    // Entities ---------------------------------------------------------- //
    public set(data: T_SetEntityType): T_EntityType {
        return this.parent ? this.parent.set(data) : this.setInSelf(data);
    }

    public unset(entity: T_EntityType | string): T_EntityType | undefined {
        return this.parent ? this.parent.unset(entity) : this.unsetInSelf(entity);
    }

    public has(entity: T_EntityType | string): boolean {
        const id = typeof entity === "string" ? entity : this.getIdFromEntity(entity as any);
        return !!this.entityContainersMap[id];
    }

    private setInSelf(data: T_SetEntityType): T_EntityType {
        const id = this.getOrCreateIdFromEntity(data, this.idKey);
        const entity = {
            ...(data as any),
            [this.idKey]: id.id,
        };
        const container = Object.assign(
            id.isNew ? {} : this.entityContainersMap[id.id],
            { entity }
        );
        
        if (id.isNew) {
            this.entityContainers.push(container);
            this.entityContainersMap[id.id] = container;
        }
        
        this.eventEmitter.emit("set", entity);

        return entity;
    }

    private unsetInSelf(entity: T_EntityType | string): T_EntityType | undefined {
        const id = typeof entity === "string" ? entity : this.getIdFromEntity(entity as any);
        const container = this.entityContainersMap[id];

        delete this.entityContainersMap[id];

        if (!container) return;

        const index = this.entityContainers.indexOf(container);

        if (index === -1) return;

        this.entityContainers.splice(index, 1);

        this.eventEmitter.emit("unset", container.entity);

        return container.entity;
    }

    private getIdFromEntity(data: T_SetEntityType, idKey: string = this.idKey): string | undefined {
        return data[idKey];
    }

    private getOrCreateIdFromEntity(data: T_SetEntityType, idKey: string = this.idKey): { id: string, isNew: boolean } {
        const foundId = this.getIdFromEntity(data);
        const isNew = foundId !== "string";
        
        return { 
            id: isNew ? `entity_${this.nextEntityId++}` : foundId,
            isNew,
        };
    }

    // Pipes ---------------------------------------------------------- //
    public pipe(options: IEntityListPipeOptions<T_EntityType, T_UnmappedEntityType>): EntityList<T_EntityType, T_SetEntityType, T_UnmappedEntityType> {
        const el = new EntityList<T_EntityType, T_SetEntityType, T_UnmappedEntityType>();
        el.pipeTo(this, options);
        return el;
    }

    public pipeTo(
        parent: EntityList<T_EntityType, T_SetEntityType, T_UnmappedEntityType>, 
        { filter, map }: IEntityListPipeOptions<T_EntityType, T_UnmappedEntityType>
    ) {
        this.parent = parent;
        this.filter = filter;
        this.map = map;
        
        this.parent.on("set", this.onParentSet, this);
        this.parent.on("unset", this.onParentUnset, this);
    }

    private onParentSet(entity: T_EntityType) {
        if (this.filter && !this.filter(entity)) return;
        return this.setInSelf(entity as any);
    }

    private onParentUnset(entity: T_EntityType) {
        if (!this.has(entity) || (this.filter && !this.filter(entity))) return;
        this.unsetInSelf(entity);
    }

    // Events ---------------------------------------------------------- //
    public on(event: string, fn: TListenerFn<T_EntityType>, context?: any): number {
        return this.eventEmitter.on(event, fn, context);
    }
    public off(listenerId: number) {
        this.eventEmitter.off(listenerId);
    }
}