export interface IEntityContainer {
    entity: any;
}
export declare class EntityListBase<T_Entity = {
    [key: string]: any;
}> {
    length: number;
    updateTime: number;
    protected renderTime: number;
    protected idKey: string;
    protected nextEntityIdInc: number;
    protected renderedEntities: ReadonlyArray<Readonly<T_Entity>>;
    protected entityContainers: IEntityContainer[];
    protected entityContainersMap: {
        [entityId: string]: IEntityContainer;
    };
    constructor(idKey?: string);
    set(data: any): Readonly<T_Entity>;
    get(data: T_Entity | string): Readonly<T_Entity> | undefined;
    unset(data: T_Entity | string): Readonly<T_Entity> | undefined;
    setMany(datas: any[]): void;
    toArray(): ReadonlyArray<Readonly<T_Entity>>;
    protected setLocalExact(entity: T_Entity): T_Entity;
    private findId;
    private generateId;
    private render;
}
