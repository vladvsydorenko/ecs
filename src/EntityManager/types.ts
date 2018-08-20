export enum EEntityManagerEventTypes {
    set = "set",
    unset = "unset",
}

export type TEntityManagerListenerFn<T> = (entity: Readonly<T>) => any;
