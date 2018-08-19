export type TEntityManagerListenerFn<T> = (entity: T) => any;

export enum EEntityManagerEventTypes {
    set = "set",
    unset = "unset",
}
