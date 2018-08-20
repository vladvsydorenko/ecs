import { EntityManager } from "./EntityManager";
import { EEntityManagerEventTypes } from "./EntityManager/types";

const em = new EntityManager<{ [key: string]: any }>();

em.on(EEntityManagerEventTypes.set, entity => {
    console.log("set 1");
});

em.on(EEntityManagerEventTypes.unset, entity => {
    console.log("unset 1");
});

const em2 = em.pipe((entity) => {
    return entity.type === "userInput";
});

em2.on(EEntityManagerEventTypes.set, entity => {
    console.log("so it works?", entity);
});

em.set({
    type: "userInput",
    name: "down",
});

const up = em2.set({
    type: "userInput",
    name: "Up",
});

em2.unset(up);
