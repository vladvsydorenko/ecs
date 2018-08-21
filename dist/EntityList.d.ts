import { EntityListBase } from "./EntityListBase";
import { TListenerFn } from "./EventEmitter";
export declare enum EEntityListEventTypes {
    set = "set",
    unset = "unset"
}
export declare type TEntityListTransform<T_Entity> = (entity: T_Entity) => T_Entity | boolean;
export declare class EntityList<T_Entity> extends EntityListBase<T_Entity> {
    private eventEmitter;
    private parent;
    private parentSetListenerId;
    private parentUnsetListenerId;
    private transform;
    constructor(idKey?: string, transform?: TEntityListTransform<T_Entity>);
    set(data: any): T_Entity | undefined;
    unset(data: T_Entity | string): T_Entity | undefined;
    setLocal(data: any): T_Entity | undefined;
    unsetLocal(data: T_Entity | string): T_Entity | undefined;
    pipe(transform: (entity: T_Entity) => T_Entity): EntityList<any>;
    pipeFrom(parent: EntityList<any>): EntityList<T_Entity>;
    unpipe(): EntityList<T_Entity>;
    on(eventType: EEntityListEventTypes, fn: TListenerFn<T_Entity>, context?: any): number;
    off(listenerId: number): void;
}
