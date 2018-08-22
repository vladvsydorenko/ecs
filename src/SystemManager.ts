import { EntityManager, TEntityManagerTransformFn, EEntityManagerEventTypes } from "./EntityManager";

interface ISystemContainer<T> {
    system: ISystem<T>;
    updateTimeoutId: number;
    isInUpdate: boolean;
    branch: EntityManager<T>;
    branchListenerIds: Symbol[];
}

export interface ISystem<T = any> {
    start?: (entities: EntityManager<T>, system: ISystem<T>) => any;
    update?: (entities: EntityManager<T>, system: ISystem<T>) => any;
    stop?: (entities: EntityManager<T>, system: ISystem<T>) => any;
    groups?: {
        [groupId: string]: TEntityManagerTransformFn<T, any>;
    }
}

export interface ISystemManagerOptions {
    idKey?: string;
    systems?: ISystem[];
}

export class SystemManager<T = any> {

    private idKey: string;
    private entities: EntityManager<T>;
    private systemContainers: ISystemContainer<T>[] = [];

    constructor(options: ISystemManagerOptions = { idKey: "id" }) {

        this.entities = new EntityManager<T>({
            idKey: options.idKey,
            groups: { all: () => true, },
        });

        if (options.systems) this.addMany(options.systems);
    }

    public add(system: ISystem) {
        this.systemContainers.push({
            system,
            branch: this.entities.branch({ groups: system.groups }),
            branchListenerIds: [],
            isInUpdate: false,
            updateTimeoutId: null
        });
    }

    public addMany(systems: ISystem[]) {
        systems.forEach(this.add, this);
    }

    public start() {
        this.systemContainers.forEach(container => {
            const { system, branch } = container;

            if (system.update) {
                const updateHandler = () => {
                    clearTimeout(container.updateTimeoutId);

                    if (container.isInUpdate) {
                        container.updateTimeoutId = setTimeout(updateHandler, 0);
                        return;
                    }

                    container.isInUpdate = true;
                    system.update(branch, system);
                    container.isInUpdate = false;
                }

                container.branchListenerIds = [
                    branch.on(EEntityManagerEventTypes.set, updateHandler),
                    branch.on(EEntityManagerEventTypes.unset, updateHandler),
                ];
            }

            if (system.start) {
                container.isInUpdate = true;
                system.start(branch, system);
                container.isInUpdate = false;
            }
        });
    }

    public stop() {
        this.systemContainers.forEach(({ branchListenerIds, branch, system }) => {
            branchListenerIds.forEach(branch.off, branch);
            if (system.stop) system.stop(branch, system);
        });
    }
}
