import { EntityManager } from "./EntityManager";

const em = new EntityManager<any>({ idKey: "id", groups: {
    "all": () => true,
} });
const em2 = em.branch({
    groups: {
        "users": entity => typeof entity.name === "string",
    }
});
const em3 = em2.branch({
    groups: {
        "users": entity => (
            typeof entity.name === "string" &&
            typeof entity.password === "string"
        ),
    }
});

em.set({
    id: "1",
    name: "Test User",
});

em3.set({
    id: "2",
    name: "Another Test User",
});

em2.set({
    id: "3",
    name: "Another Test User",
    password: "superPassword",
});

console.log(em2.groups);
console.log(em3.groups);
