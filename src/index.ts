import { List } from "./List";

const list = new List();

const entity = list.set({
    name: "Petroniy",
});

list.set({
    ...entity,
    name: "Vasylka",
});

console.log(list);
