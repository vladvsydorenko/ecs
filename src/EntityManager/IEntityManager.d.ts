import { IEntity } from "./IEntity";
import { EEntityManagerEventTypes, TEntityManagerListenerFn } from "./types";

export interface IEntityManager<T, U> {
    set: (entity: U) => T;
    get: (id: string | T) => IEntity | undefined;
    has: (id: string | T) => boolean;
    unset: (id: string | T) => IEntity | undefined;
    // remove all entities
    clear: () => void;

    on: (event: EEntityManagerEventTypes, fn: TEntityManagerListenerFn, context?: any) => string;
    off: (listenerId: string) => void;

    // listen to parent updates
    attach: (parent: IEntityManager<T, U>) => void;
    // stop listen to parent updates
    detach: () => void;

    filter: (fn: (entity: IEntity) => boolean) => IEntityManager<T, U>;
}
