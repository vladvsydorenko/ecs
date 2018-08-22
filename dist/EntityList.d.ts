export interface IEntityListOptions {
    id?: string;
    idKey?: string;
}
export declare class EntityList<T = any> {
    length: number;
    private id;
    private idKey;
    private entities;
    private sortedEntities;
    constructor(options?: IEntityListOptions);
    set(data: T): T;
    get(data: T | string): T | undefined;
    unset(data: T | string): T | undefined;
    toArray(): ReadonlyArray<T>;
    toObject(): Readonly<{
        [entity: string]: T;
    }>;
    private remove;
}
