export interface IListItem { readonly id: number; }
export interface IListItemData { 
    readonly id?: number;
    readonly [key: string]: any;
};

export class List<T extends IListItem = IListItem> {

    private items: { [id: number]: IListItem } = {};
    private nextItemId = 0;

    public set(data: IListItemData): IListItem {
        const id = data.id !== undefined ? data.id : this.nextItemId++;
        const entity = this.items[id] = Object.freeze({
            ...data,
            id,
        });
        return entity;
    }

    public unset(item: IListItem) {
        if (!this.items[item.id]) throw new Error(`Attempt to unset not existed item by id "${item.id}"`);
        delete this.items[item.id];
    }

    public on() {}
    public off() {}
    public toArray() {}

}
