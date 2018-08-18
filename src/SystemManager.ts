import { List, IListItem, EListEventTypes } from "./List";

export interface ISystem {
    update: (em: List<IListItem>) => any;
}

interface ISystemContainer {
    id: number; 
    system: ISystem;
}

export class SystemManager {

    private em: List<IListItem>;
    private systems: ISystemContainer[] = [];
    private emListenerIds: number[] = [];

    private isInUpdate = false;
    private nextSystemId = 0;
    private updateTimeoutId: number = null;



    constructor(em: List = new List<IListItem>()) {
        this.em = em;
    }

    public start() {
        this.emListenerIds.push(this.em.on(EListEventTypes.set, this.onUpdate, this));
        this.emListenerIds.push(this.em.on(EListEventTypes.unset, this.onUpdate, this));
    }

    public stop() {
        this.emListenerIds.forEach(id => this.em.off(id));        
    }

    public add(system: ISystem): number {
        const id = this.nextSystemId++;
        this.systems.push({
            id,
            system
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
        this.isInUpdate = true;
        this.systems.forEach(system => {
            system.system.update(this.em);
        });
        this.isInUpdate = false;
    }

    private onUpdate() {
        if (!this.isInUpdate) { 
            this.update();
            return;
        }

        clearTimeout(this.updateTimeoutId);
        this.updateTimeoutId = setTimeout(this.onUpdate);
    }

}
