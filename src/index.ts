import { EntityManager } from "./EntityManager";
import { EntityList } from "./EntityList";

const em = new EntityManager<any>({ idKey: "id", noDefaultGroups: true });

em.addGroup("test", entity => {
    return typeof entity.name === "string"
});

em.set({
    id: "1",
    name: "Hi"
});

// em.set({
//     id: "1"
// });

console.log(em.groups);
