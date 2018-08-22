import { EntityList } from "./EntityList";
import { TEventListener } from "./EventEmitter";
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
export declare type TEntityManagerTransformFn<T, R = T> = (entity: T) => boolean | R;
export interface IEntityManagerGroups {
    [groupId: string]: EntityList<any>;
}
export declare enum EEntityManagerEventTypes {
    set = "set",
    unset = "unset",
    update = "update"
}
export declare class EntityManager<T = any, T_Groups extends IEntityManagerGroups = IEntityManagerGroups> {
    groups: Readonly<T_Groups>;
    version: symbol;
    private idKey;
    private groupEntityLists;
    private groupTransforms;
    private lastEntity;
    private parent;
    private parentListenerIds;
    private eventEmitter;
    static nextIdInc: number;
    constructor(options?: IEntityManagerOptions);
    group<R = T>(id: string, transform: TEntityManagerTransformFn<T, R>): void;
    ungroup<R>(id: string): void;
    getGroups(): Readonly<IEntityManagerGroups>;
    groupMany(groups: IEntityManagerOptions["groups"]): void;
    set(data: T): void;
    unset(data: T | string): void;
    setMany(datas: T[]): void;
    unsetMany(datas: (T | string)[]): void;
    setLocal(data: T): void;
    unsetLocal(data: T | string): void;
    setParent(parent: EntityManager<any>): void;
    unsetParent(): void;
    on(eventId: string, listener: TEventListener<T>, thisArg?: any): Symbol;
    off(listenerId: Symbol): void;
    branch(options?: IEntityManagerBranchOptions): EntityManager<any, IEntityManagerGroups>;
    static generateId(): Symbol;
}
