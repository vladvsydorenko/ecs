import { List, EListEventTypes } from "./List";

const list = new List();

const entity = list.set({
    name: "Petroniy",
});

const id = list.on(EListEventTypes.set, entity => {
    console.log("set", entity);
}, this);
const id2 = list.on(EListEventTypes.unset, entity => {
    console.log("unset", entity);
}, this);
// list.off(id);

const item = list.set({
    ...entity,
    name: "Vasylka",
});
// list.unset(item);

console.log(list.toArray());

// list.unset(entity);

// console.log(list);
