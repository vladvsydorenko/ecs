import { IEntity } from "./IEntity";

export type TEntityManagerListenerFn = (entity: IEntity) => any;

export enum EEntityManagerEventTypes {
    set = "set",
    unset = "unset",
}
