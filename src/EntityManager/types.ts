export interface IEntity {
    [key: string]: any;
}

export enum EEntityManagerEventTypes {
    set = "set",
    unset = "unset",
}

export type TEntityManagerListenerFn<T> = (entity: Readonly<T>) => any;

export type TEntityManagerParentFilter<T> = (entity: Readonly<T>) => boolean;
