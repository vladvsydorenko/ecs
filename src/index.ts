import { EntityList } from "./EntityList";

const users = new EntityList<any>();
const named = users.pipe(entity => typeof entity.name === "string");
const namedAndAged = named.pipe(entity => typeof entity.age === "number");


users.set({
    name: "John"
});
named.set({
    name: "Jack"
});
namedAndAged.set({
    name: "Many Times",
    age: 20,
});
namedAndAged.set({
    name: "Alex Z",
    age: 25,
});

console.log(users, named, namedAndAged);
