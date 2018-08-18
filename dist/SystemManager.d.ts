import { EntityManager, IEntity } from "./EntityManager";
export interface ISystem {
    update: (em: EntityManager<IEntity>) => any;
    start?: (em: EntityManager<IEntity>) => any;
}
export declare class SystemManager {
    private em;
    private systems;
    private emListenerIds;
    private isInUpdate;
    private nextSystemId;
    private updateTimeoutId;
    constructor(em: EntityManager);
    start(): void;
    stop(): void;
    add(system: ISystem): number;
    remove(id: number): void;
    update(): void;
    private onUpdate;
}
