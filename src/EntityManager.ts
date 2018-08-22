import { EntityList } from "./EntityList";
import { TEventListener, EventEmitter } from "./EventEmitter";

interface IEntityManagerGroupTransform<T> {
    id: string | Symbol;
    transform: TEntityManagerTransformFn<T, any>;
}

export interface IEntityManagerOptions {
    idKey?: string;
    parent?: EntityManager<any>;
    groups?: {
        [groupId: string]: TEntityManagerTransformFn<any>;
    };
}

export interface IEntityManagerBranchOptions {
    groups?: {
        [groupId: string]: TEntityManagerTransformFn<any>;
    };
}

export type TEntityManagerTransformFn<T, R = T> = (entity: T) => boolean | R;

export interface IEntityManagerGroups { [groupId: string]: EntityList<any>; }

export enum EEntityManagerEventTypes {
    set = "set",
    unset = "unset",
    update = "update",
}

export class EntityManager<
    T = any,
    T_Groups extends IEntityManagerGroups = IEntityManagerGroups
> {
    public groups: Readonly<T_Groups> = Object.freeze({} as any);
    public version = Symbol();

    private idKey: string;
    private groupEntityLists: EntityList<EntityList>;
    private groupTransforms: EntityList<IEntityManagerGroupTransform<T>>;
    private lastEntity: T = null;

    private parent: EntityManager<any>;
    private parentListenerIds: Symbol[] = [];

    private eventEmitter = new EventEmitter();

    static nextIdInc = 0;

    constructor(options: IEntityManagerOptions = {}) {
        this.idKey = options.idKey || "id";

        this.groupEntityLists = new EntityList<EntityList>({ idKey: "id" });
        this.groupTransforms = new EntityList<IEntityManagerGroupTransform<T>>({ idKey: "id", });

        if (options.parent) this.setParent(options.parent);
        if (options.groups) this.groupMany(options.groups);
    }

    public group<R = T>(id: string, transform: TEntityManagerTransformFn<T, R>): void {
        this.groupTransforms.set({
            id,
            transform,
        });

        const el = new EntityList<EntityList>({ idKey: this.idKey, id });
        this.groupEntityLists.set(el);
        this.groups = {
            ...(this.groups as any),
            [id]: el,
        };
    }

    public ungroup<R>(id: string): void {
        this.groupTransforms.unset(id);
    }

    public getGroups(): Readonly<IEntityManagerGroups> {
        return this.groupEntityLists.toObject();
    }

    public groupMany(groups: IEntityManagerOptions["groups"]) {
        Object
            .keys(groups)
            .forEach(groupId => {
                this.group(groupId, groups[groupId]);
            }, this);
    }

    public set(data: T): void {
        if (this.parent) this.parent.set(data);
        else this.setLocal(data);
    }

    public unset(data: T | string): void {
        if (this.parent) this.parent.unset(data);
        else this.unsetLocal(data);
    }

    public setMany(datas: T[]): void {
        const versionBefore = this.version;

        this.eventEmitter.mute();

        datas.forEach(this.set, this);

        this.eventEmitter.unmute();

        // if any of datas went to any of groups
        if (versionBefore !== this.version) this.eventEmitter.emit(EEntityManagerEventTypes.update, this.lastEntity);
    }

    public unsetMany(datas: (T | string)[]): void {
        const versionBefore = this.version;

        this.eventEmitter.mute();

        datas.forEach(this.unset, this);

        this.eventEmitter.unmute();

        // if any of datas went to any of groups
        if (versionBefore !== this.version) this.eventEmitter.emit(EEntityManagerEventTypes.update, this.lastEntity);
    }

    public setLocal(data: T): void {
        let isSet = false;
        let isUnset = false;

        this.groupTransforms.toArray().forEach(({ id, transform }) => {
            const result = transform(data);
            const group = this.groupEntityLists.get(id as any);

            if (result === false) {
                const unsetResult = group.unset(data);

                if (unsetResult) {
                    isUnset = !isSet;

                    this.lastEntity = data;
                    this.version = Symbol();
                }
            }
            else {
                const entity = result === true ? data : result;

                group.set(entity);

                this.lastEntity = data;
                this.version = Symbol();

                isSet = true;
                isUnset = false;
            }

        });

        if (isSet) this.eventEmitter.emit(EEntityManagerEventTypes.set, data);
        else if (isUnset) this.eventEmitter.emit(EEntityManagerEventTypes.unset, data);
    }

    public unsetLocal(data: T | string): void {
        this.groupTransforms.toArray().forEach(({ id }) => {
            const group = this.groupEntityLists.get(id as any);
            const result = group.unset(data);

            if (result) {
                this.lastEntity = result;
                this.version = Symbol();
            }
        });

        this.eventEmitter.emit(EEntityManagerEventTypes.unset, data);
    }

    public setParent(parent: EntityManager<any>): void {
        if (this.parent) this.unsetParent();
        this.parent = parent;
        this.parentListenerIds = [
            parent.on(EEntityManagerEventTypes.set, this.setLocal, this),
            parent.on(EEntityManagerEventTypes.unset, this.unsetLocal, this),
        ];
    }

    public unsetParent(): void {
        if (!this.parent) return;

        this.parentListenerIds.forEach(this.parent.off, this.parent);
        this.parent = undefined;
    }

    public on(eventId: string, listener: TEventListener<T>, thisArg?: any): Symbol {
        return this.eventEmitter.on(eventId, listener, thisArg);
    }

    public off(listenerId: Symbol): void {
        this.eventEmitter.off(listenerId);
    }

    public branch(options?: IEntityManagerBranchOptions) {
        return new EntityManager({
            parent: this,
            idKey: this.idKey,
            groups: options ? options.groups : undefined,
        });
    }

    static generateId(): Symbol {
        return Symbol("entityId");
    }
}
