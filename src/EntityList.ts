export interface IEntityListOptions {
    id?: string;
    idKey?: string;
}

export class EntityList<T = any> {

    public length = 0;

    private id: string;
    private idKey: string;
    private entities: T[] = [];
    private sortedEntities: { [entityId: string]: T; } = {};

    constructor(options: IEntityListOptions = {}) {
        this.id = String(options.id);
        this.idKey = options.idKey || "id";
    }

    public set(data: T): T {
        const id = (data as any)[this.idKey];

        this.remove(this.sortedEntities[id]);

        this.entities.push(data);
        this.sortedEntities[id] = data;

        this.length = this.entities.length;

        return data;
    }

    public get(data: T | string): T | undefined {
        const id = typeof data === "string" ? data : (data as any)[this.idKey];
        return this.sortedEntities[id];
    }

    public unset(data: T | string): T | undefined {
        const id = typeof data === "string" ? data : (data as any)[this.idKey];
        const entity = this.sortedEntities[id];

        return this.remove(entity);
    }

    public toArray(): ReadonlyArray<T> {
        return Object.freeze([ ...this.entities ]);
    }

    public toObject(): Readonly<{ [entity: string]: T }> {
        return Object.freeze({ ...this.sortedEntities });
    }

    private remove(data: T): T | undefined {
        const index = this.entities.indexOf(data);

        if (index === -1) return;

        this.entities = [
            ...this.entities.slice(0, index),
            ...this.entities.slice(index + 1),
        ];
        delete this.sortedEntities[(data as any)[this.idKey]];

        this.length = this.entities.length;

        return data;
    }

}