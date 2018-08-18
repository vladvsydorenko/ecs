import { SystemManager } from "./SystemManager";
import { List } from "./List";

const em = new List();
const sm = new SystemManager(em);

const id = sm.add({
    update(em: List) {
        console.log("updated", em);
    },
});

sm.start();

em.set({
    name: "Vasyl",
});

// console.log(sm);
