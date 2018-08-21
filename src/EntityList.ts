import { EventEmitter, TListenerFn } from "./EventEmitter";

interface IEntityContainer<T_Entity> { entity: T_Entity; }

export enum EEntityListEventTypes {
    set = "set",
    unset = "unset",
    free = "free",
};

export type TEntityListSetHandler<T_Entity> = (data: any | T_Entity, el: EntityList<T_Entity>) => T_Entity;
export type TEntityListUnsetHandler<T_Entity> = (entityId: string | T_Entity, el: EntityList<T_Entity>) => T_Entity | undefined;;

export class EntityList<T_Entity = { [key: string]: any; }> {
    public length = 0;
    public modifyTime = 0;

    private eventEmitter = new EventEmitter<T_Entity>();
    private nextEntityId = 0;
    private idKey = "id";
    private entityContainers: IEntityContainer<T_Entity>[] = [];
    private entityContainersMap: { [id: string]: IEntityContainer<T_Entity>; } = {};

    constructor() {
        this.updateModifyTime();
    }

    public set(data: any | T_Entity): T_Entity | undefined {
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

    public unset(data: string | T_Entity): T_Entity | undefined {
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

        return container.entity;    }

    private generateId(): string {
        return `entity_${this.nextEntityId++}`;
    }

    private findId(data: any): string | undefined {
        const passedId = data[this.idKey];
        return typeof(passedId) === "string" ? passedId : undefined;
    }

    private updateModifyTime() {
        this.modifyTime = Date.now();
    }
}
