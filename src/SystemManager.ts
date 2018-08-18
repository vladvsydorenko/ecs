import { EntityManager, IEntity, EEntityManagerEventTypes } from "./EntityManager";

export interface ISystem {
    update: (em: EntityManager<IEntity>) => any;
    start?: (em: EntityManager<IEntity>) => any;
}

interface ISystemContainer {
    id: number;
    system: ISystem;
    lastUpdated: number;
}

export class SystemManager {

    private em: EntityManager<IEntity>;
    private systems: ISystemContainer[] = [];
    private emListenerIds: number[] = [];

    private isInUpdate = false;
    private nextSystemId = 0;
    private updateTimeoutId: number = null;

    constructor(em: EntityManager) {
        this.em = em;
    }

    public start() {
        const { em } = this;
        this.systems.forEach(({ system }) => system.start && system.start(em));
        this.emListenerIds.push(em.on(EEntityManagerEventTypes.set, this.onUpdate, this));
        this.emListenerIds.push(em.on(EEntityManagerEventTypes.unset, this.onUpdate, this));
        if (this.systems.length > 0 && this.em.length > 0) this.update();
    }

    public stop() {
        this.emListenerIds.forEach(id => this.em.off(id));        
    }

    public add(system: ISystem): number {
        const id = this.nextSystemId++;
        this.systems.push({
            id,
            system,
            lastUpdated: null,
        })
        return id;
    }

    public remove(id: number) {
        let index = -1;
        this.systems.some((system, i) => {
            if (system.id !== id) return;
            index = i;
            return true;
        });
        if (index === -1) throw new Error(`Attempt to remove not added system with id "${id}"`);
        this.systems.splice(index, 1);
    }

    public update() {
        const { em } = this;
        this.isInUpdate = true;
        this.systems.forEach(container => {
            if (container.lastUpdated === em.lastUpdated) return;
            container.system.update(em);
            container.lastUpdated = em.lastUpdated;
        });
        this.isInUpdate = false;
    }

    private onUpdate() {
        if (!this.isInUpdate) { 
            this.update();
            return;
        }

        clearTimeout(this.updateTimeoutId);
        this.updateTimeoutId = setTimeout(() => this.onUpdate());
    }

}
