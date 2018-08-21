import { EntityListBase } from "./EntityListBase";
import { EventEmitter, TListenerFn } from "./EventEmitter";

export enum EEntityListEventTypes {
    set = "set",
    unset = "unset",
};

export type TEntityListTransform<T_Entity> = (entity: T_Entity) => T_Entity | boolean;

export class EntityList<T_Entity> extends EntityListBase<T_Entity> {

    private eventEmitter = new EventEmitter<T_Entity>();
    private parent: EntityList<T_Entity | any> = null;

    private parentSetListenerId: number = null;
    private parentUnsetListenerId: number = null;

    private transform: TEntityListTransform<T_Entity> = null;

    constructor(idKey: string = "id", transform: TEntityListTransform<T_Entity> = null) {
        super(idKey);
        this.transform = transform;
    }

    public set(data: any): T_Entity | undefined {
        if (this.parent) return this.parent.set(data);
        return this.setLocal(data);
    }

    public unset(data: T_Entity | string): T_Entity | undefined {
        if (this.parent) return this.parent.unset(data);
        return this.unsetLocal(data);
    }

    public setLocal(data: any): T_Entity | undefined {
        const entity = super.set(data);
        this.eventEmitter.emit(EEntityListEventTypes.set, entity);
        return entity;
    }

    public unsetLocal(data: T_Entity | string): T_Entity | undefined {
        const entity = super.unset(data);
        if (entity) this.eventEmitter.emit(EEntityListEventTypes.unset, entity);
        return entity;
    }

    public pipe(transform: (entity: T_Entity) => T_Entity ): EntityList<any> {
        const el = new EntityList<any>(this.idKey, transform);
        el.pipeFrom(this);
        return el;
    }

    public pipeFrom(parent: EntityList<any>): EntityList<T_Entity> {
        this.parent = parent;
        this.parentSetListenerId = parent.on(EEntityListEventTypes.set, data => {
            let entity;
            if (this.transform) {
                const result = this.transform(data);
                if (typeof result === "boolean") {
                    if (result) entity = data;
                }
                else {
                    entity = result;
                }
            }
            else entity = data;
            if (entity) this.setLocalExact(entity);
        });
        this.parentUnsetListenerId = parent.on(EEntityListEventTypes.unset, data => this.unsetLocal(data));

        return this;
    }

    public unpipe(): EntityList<T_Entity> {
        const { parent } = this;

        if (!parent) return;

        parent.off(this.parentSetListenerId);
        parent.off(this.parentUnsetListenerId);

        this.parentSetListenerId = null;
        this.parentUnsetListenerId = null;

        return this;
    }

    public on(eventType: EEntityListEventTypes, fn: TListenerFn<T_Entity>, context?: any): number {
        return this.eventEmitter.on(eventType, fn, context);
    }
    public off(listenerId: number) {
        this.eventEmitter.off(listenerId);
    }

}