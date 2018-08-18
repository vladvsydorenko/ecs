# ECS
Simple ecs implementation, inspired by [Unity3d ECS](https://unity3d.com/learn/tutorials/topics/scripting/introduction-ecs).

# Getting Started
## Installation
### npm
`npm install @vladnet/ecs`

### yarn
`yarn add @vladnet/ecs`

```ts
import { ECS } from "@vladnet/ecs";

const em = new ECS.EntityManager();
const sm = new ECS.SystemManager(em);
```

## Entities
Entities are managed by `EntityManager`.
There are only two methods to work with entities, `set` and `unset`.

### Set
Set *without id* creates new entity, set *with id* updates existed one.
```ts
console.log(em.length); // 0

// create new entity
let myEntity = em.set({
    name: "Petryk",
});
console.log(myEntity); // { id: "entity_1", name: "Petryk", }
console.log(em.length); // 1

// update existed one
myEntity = em.set({
    id: newEntity.id,
    name: "Vasylko",
}); 
console.log(myEntity); //{ id: "entity_1", name: "Vasylko", }
console.log(em.length); // 1
```

### Unset
Just pass an entity id.
```ts
em.unset(myEntity.id);
```

### Immutable
EntityManager never mutates your data.
```ts
// create new entity
const newEntity = em.set({
    name: "Petryk",
});
console.log(newEntity); // { id: "entity_1", name: "Petryk", }

// update existed one
const updatedEntity = em.set({
    id: newEntity.id,
    name: "Vasylko",
}); 
console.log(updatedEntity); //{ id: "entity_1", name: "Vasylko", }
console.log(newEntity === updatedEntity); // false
```

### forEach/filter/find/toArray etc
EntityManager has few methods working in the same way as such methofs in `Array`: 
`forEach`, `filter`, `find`, `some`, `every`.

Sure thing, you can get plain array by `em.toArray()`.

### Observe
You could subscribe to `set` or `unset` events.
```ts
// on set
em.on(ECS.EEntityManagerEventTypes.set, (entity: ECS.IEntity) => {
    // entity was set (new or updated)
}, context /* `this` for listener */);

// on unset
em.on(ECS.EEntityManagerEventTypes.unset, (entity: ECS.IEntity) => {
    // entity was unset, do forget it and move forward
}, context /* `this` for listener */);
```

## Systems

