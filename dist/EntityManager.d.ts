export interface IEntity {
    readonly id: string;
    readonly [key: string]: any;
}
export interface IEntityData {
    readonly id?: string;
    readonly [key: string]: any;
}
export declare type IEntityManagerListenerFn<T extends IEntity> = (entity: T) => any;
export declare enum EEntityManagerEventTypes {
    set = "set",
    unset = "unset"
}
export declare class EntityManager<T extends IEntity = IEntity> {
    length: number;
    lastUpdated: number;
    private entities;
    private listeners;
    private nextEntityId;
    private nextListenerId;
    constructor(entities?: {
        [id: string]: T;
    });
    set(data: IEntityData): T;
    unset(entity: T): void;
    on(event: EEntityManagerEventTypes, fn: IEntityManagerListenerFn<T>, context?: any): number;
    off(id: number): void;
    toArray(): T[];
    forEach(fn: (value: T, index: number, arr: T[]) => any): void;
    filter(fn: (value: T, index: number, arr: T[]) => any): T[];
    find(fn: (value: T, index: number, arr: T[]) => any): T;
    some(fn: (value: T, index: number, arr: T[]) => any): boolean;
    every(fn: (value: T, index: number, arr: T[]) => any): boolean;
    private notify;
}
