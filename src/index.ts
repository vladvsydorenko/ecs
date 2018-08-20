import { EntityManager } from "./EntityManager";
import { EEntityManagerEventTypes } from "./EntityManager/types";

const em = new EntityManager<{ [key: string]: any }>();

em.on(EEntityManagerEventTypes.set, entity => {
    console.log("set", entity);
});

em.on(EEntityManagerEventTypes.unset, entity => {
    console.log("unset", entity, em);
});

const entity = em.set({
    name: "Vasyl",
});
const entity2 = em.set({
    name: "Vasyl",
});

// em.unset(entity);

console.log(em.toArray(), em.length);
