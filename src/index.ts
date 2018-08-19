import { EntityManager } from "./EntityManager/EntityManager";
import { EEntityManagerEventTypes } from "./EntityManager/types";

const em = new EntityManager();

em.on(EEntityManagerEventTypes.set, (entity) => {
    console.log("Yeah!", entity);
});

em.set({
    name: "Petryk"
});

const vasyl = em.set({
    name: "Vasyl"
});

em.set({
    ...vasyl,
    name: "Vasyl Petrykivkovych"
});

em.unset(vasyl);

console.log(em);
