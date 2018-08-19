import { EntityManager } from "./EntityManager/EntityManager";

const em = new EntityManager();

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
