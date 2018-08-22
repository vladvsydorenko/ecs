import { EntityList } from "./EntityList";

interface IEntityManagerGroup<T> {
    id: string;
    transform: TEntityManagerTransformFn<T, any>;
}

export interface IEntityManagerOptions {
    idKey?: string;
    noDefaultGroups?: boolean;
}

export type TEntityManagerTransformFn<T, R = T> = (entity: T) => boolean | R;

export interface IEntityManagerGroups { [groupId: string]: EntityList<any>; }

export class EntityManager<
    T,
    T_Groups extends IEntityManagerGroups = IEntityManagerGroups
> {
    public length = 0;
    public groups: Readonly<T_Groups> = Object.freeze({} as any);

    private idKey: string;
    private groupEntityLists: EntityList<EntityList>;
    private groupTransforms: EntityList<IEntityManagerGroup<T>>;

    constructor(options: IEntityManagerOptions = {}) {
        this.idKey = options.idKey || "id";

        this.groupEntityLists = new EntityList<EntityList>({ idKey: "id" });
        this.groupTransforms = new EntityList<IEntityManagerGroup<T>>({ idKey: "id", });

        if (!options.noDefaultGroups) this.addGroup("all", () => true);
    }

    public addGroup<R>(id: string, transform: TEntityManagerTransformFn<T, R>): void {
        this.groupTransforms.set({
            id,
            transform,
        });

        const el = new EntityList<EntityList>({ idKey: this.idKey, id });
        this.groupEntityLists.set(el);
        this.groups = {
            ...(this.groups as any),
            [id]: el,
        };
    }

    public removeGroup<R>(id: string): void {
        this.groupTransforms.unset(id);
    }

    public getGroups(): IEntityManagerGroups {
        return this.groupEntityLists.toObject();
    }

    public set(data: T): void {
        this.groupTransforms.toArray().forEach(({ id, transform }) => {
            const result = transform(data);
            const group = this.groupEntityLists.get(id);

            if (result === false) {
                group.unset(data);
                return;
            }

            const entity = result === true ? data : result;
            group.set(entity);
        });
    }

    public unset(data: T | string): void {
        this.groupTransforms.toArray().forEach(({ id, transform }) => {
            const group = this.groupEntityLists.get(id);
            group.unset(data);
        });
    }
}
