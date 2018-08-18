# ECS
Simple ecs implementation, inspired by [Unity3d ECS](https://unity3d.com/learn/tutorials/topics/scripting/introduction-ecs).

# Getting Started
## Installation
### npm
`npm install @vladnet/ecs`

### yarn
`yarn add @vladnet/ecs`

```ts
import { EntityManager, SystemManager } from "@vladnet/ecs";
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
em.on(EEntityManagerEventTypes.set, (entity: IEntity) => {
    // entity was set (new or updated)
}, context /* `this` for listener */);

// on unset
em.on(EEntityManagerEventTypes.unset, (entity: IEntity) => {
    // entity was unset, do forget it and move forward
}, context /* `this` for listener */);
```

## Systems

To manage you entities you should write a system.
System is just an object having `update` method and optional `start` method.

```ts
interface ISystem {
    update: (em: EntityManager<IEntity>) => any;
    start?: (em: EntityManager<IEntity>) => any;
}
```

```ts
const em = new EntityManager();
const sm = new SystemManager(em);

// add a system
const id = sm.add({
    update(em) {
        em
            .filter(entity => entity.name === "Vasylko")
            .forEach(entity => {
                console.log(`Another one ${entity.name}!`);
            });
    }
});

// remove a system
sm.remove(id);
```

`update` will be run each time entity manager changes (both `set` or `unset` actions).  It will not run again for system own changes. SystemManager saves timestamp when its EntityManager and systems were updated.

`start` will be run only once at SystemManager start.

### Asynchronous
Systems are asynchronous, means you could update EntityManager at anytime and all other systems will update.

### Start/Stop
```
// start all systems
sm.start();

// stop all systems
sm.stop();
```