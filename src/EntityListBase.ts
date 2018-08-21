export interface IEntityContainer {
    entity: any;
}

export class EntityListBase<
    T_Entity = { [key: string]: any; },
> {
    public length = 0;
    public updateTime = 0;

    protected renderTime = 0;

    protected idKey: string;
    protected nextEntityIdInc: number = 0;

    protected renderedEntities: ReadonlyArray<Readonly<T_Entity>> = [];
    protected entityContainers: IEntityContainer[] = [];
    protected entityContainersMap: { [entityId: string]: IEntityContainer; } = {};

    constructor(idKey: string = "idKey") {
        this.idKey = idKey;
    }

    public set(data: any): Readonly<T_Entity> {
        const passedId = this.findId(data);
        const entityId = passedId ? passedId : this.generateId();

        let container = this.entityContainersMap[entityId];

        // if new entity
        if (!container) {
            container = this.entityContainersMap[entityId] = { entity: null };
            this.entityContainers.push(container);
            this.length++;
        }

        const entity = {
            ...data,
            [this.idKey]: entityId,
        };

        container.entity = entity;
        this.updateTime = Date.now();

        return entity;
    }

    public get(data: T_Entity | string): Readonly<T_Entity> | undefined {
        const entityId: string = typeof data === "string" ? data : this.findId(data);
        const container = this.entityContainersMap[entityId];

        return container ? container.entity : undefined;
    }

    public unset(data: T_Entity | string): Readonly<T_Entity> | undefined {
        const entityId = this.findId(data);

        if (!entityId) return;

        const container = this.entityContainersMap[entityId];
        delete this.entityContainersMap[entityId];

        if (!container) return;

        const index = this.entityContainers.indexOf(container);

        if (index === -1) return;

        this.entityContainers.splice(index, 1);
        this.length--;
        this.updateTime = Date.now();

        return container.entity;
    }

    public toArray(): ReadonlyArray<Readonly<T_Entity>> {
        if (this.renderTime < this.updateTime) this.render();
        return this.renderedEntities;
    }

    private findId(data: T_Entity | string): string | undefined {
        const foundId = typeof data === "string" ? data : (data as any)[this.idKey];

        return typeof foundId === "string" ? foundId : undefined;
    }
    private generateId(): string {
        return `entity_${this.nextEntityIdInc++}`;
    }
    private render() {
        this.renderedEntities = Object.freeze(this.entityContainers.map(({ entity }) => entity));
        this.renderTime = Date.now();
    }
}