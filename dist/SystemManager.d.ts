import { EntityManager, TEntityManagerTransformFn } from "./EntityManager";
export interface ISystem<T = any> {
    start?: (entities: EntityManager<T>, system: ISystem<T>) => any;
    update?: (entities: EntityManager<T>, system: ISystem<T>) => any;
    stop?: (entities: EntityManager<T>, system: ISystem<T>) => any;
    groups?: {
        [groupId: string]: TEntityManagerTransformFn<T, any>;
    };
}
export interface ISystemManagerOptions {
    idKey?: string;
    systems?: ISystem[];
}
export declare class SystemManager<T = any> {
    private idKey;
    private entities;
    private systemContainers;
    constructor(options?: ISystemManagerOptions);
    add(system: ISystem): void;
    addMany(systems: ISystem[]): void;
    start(): void;
    stop(): void;
}
