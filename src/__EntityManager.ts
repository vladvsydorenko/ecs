interface IEntity { [key: string]: any; }
interface IEntityContainer { entity: IEntity; }

interface IEntityFilter {
    filter: (entity: IEntity) => boolean;
}

class EntityManager {

    private entityContainers: IEntityContainer[] = [];
    private entityFilters: IEntityFilter[] = [];
    private filteredEntities: { [filterId: string]: IEntityContainer[]; } = {};
    
    private parent: EntityManager = null;
    private parentListenerId: string;

    public set(entity: IEntity): string {
        return "";
    }
    public setMany(entities: IEntity) {}
    public unset(id: string) {}
    public has(id: string): boolean {
        return true;
    }

    public on(event: string, fn: (entity: IEntity) => any, context?: any): string {
        return "";
    }
    public off(listenerId: string) {};

    private filterEntity(entity: IEntity): boolean {
        return true;
    }

    public attach(em: EntityManager) {
        if (this.parent) this.detach();
        this.parent = em;
        this.parentListenerId = this.parent.on("set", entity => {
            if (this.filterEntity(entity)) this.set(entity);
            else if (this.has(entity.id)) this.unset(entity.id);
        }, this);
    }

    public detach() {
        this.parent.off(this.parentListenerId);
        this.parent = null;
    }

}
