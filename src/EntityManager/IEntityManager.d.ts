import { EEntityManagerEventTypes, TEntityManagerListenerFn } from "./types";

export interface IEntityManager<T, U = T> {
    set: (entity: U) => T;
    get: (id: string | T) => T | undefined;
    has: (id: string | T) => boolean;
    unset: (id: string | T) => T | undefined;

    on: (event: EEntityManagerEventTypes, fn: TEntityManagerListenerFn<T>, context?: any) => string;
    off: (listenerId: string) => void;

    // listen to parent updates
    attach: (parent: IEntityManager<T, U>) => void;
    // stop listen to parent updates
    detach: () => void;

    filter: (fn: (entity: T) => boolean) => IEntityManager<T, U>;
}
