import { EntityList, EEntityListEventTypes } from "./EntityList";

const el = new EntityList("id");
const el2 = el.pipe(entity => {
    return typeof entity.name === "string";
});
const el3 = el2.pipe(entity => {
    return {
        id: entity.id,
        name: `Mapped ${entity.name}`
    };
});

el.set({
    name: 20,
});

el.set({
    name: "Vasyl",
});

el.set({
    name: "Vasyl",
});

console.log(el.toArray());
console.log(el2.toArray());
console.log(el3.toArray());
