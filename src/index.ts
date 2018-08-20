import { EntityList } from "./Entity/EntityList";

const el = new EntityList();
const el2 = el.pipe({
    filter: (entity) => typeof entity.name === "string"
});

el2.on("set", (entity) => {
    console.log("entity", entity);
});

el.set({
    name: "Vasylko",
});

el.set({
    name2: "Vasylko",
});

console.log(el2);
