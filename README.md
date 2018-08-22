# RES
Reactive Entity Systems is a simple javascript library inspired by [Unity3d ECS](https://unity3d.com/learn/tutorials/topics/scripting/introduction-ecs).

# Getting Started

## Install

`npm install @vladnet/res`

or

`yarn add @vladnet/res`

## Quick example

Next system updates when someone puts an entity passing any filter described in `groups`:
```ts
import { EntityManager, ISystem } from "@vladnet/res";

const system: ISystem<any> = {
    groups: {
        userActions: entity => entity.type === "userAction",
        requests: entity => entity.type === "request",
    },

    update(entities: EntityManager<any>, system: ISystem<any>) {
        console.log(entities.groups.userActions.toArray());
        console.log(entities.groups.requests.toArray());
    },
};
```

Next, let's set some entity. To do that, just describe a start method.
In other way our system will not update ever, because there are no entities yet.

```ts
const system: ISystem<any> = {
    // groups...
    // update....
    start(entities: EntityManager<any>, system: ISystem<any>) {
        // will queue update after start method
        // because next entity will successfully added to "userActions" group
        entities.set({
            id: EntityManager.generateId(),
            type: "userAction",
            action: "click"
        });
    }
};
```

Setting entities that don't pass any group doesn't trigger update of your system.
Setting entities during update also doesn't trigger update. Only other systems' updates or setting from async operations will trigger update.

## Branch

System receives a `branch` of the main entity manager. You could fork it deeper.
```ts
const myBranch: EntityManager<any> = entities.branch({
    groups: {
        all: entity => entity.name === "Petryk",
    }
});
```

`Branch` has filtered by groups entities, but setting/unsetting entities is always starting from the top-level parent.

It means that `myBranch.set(myEntity)` will set it to the SystemManager's main entity manager and then it will flow down deeper by branches.

Actually, `branch` is just an `EntityManager` having `parent` which is also `EntityManager`.
Branch delegates setting/unsetting to its parent and listens for parent's updates.
Then, on parent update branch filters and groups an entity.
It was done so because an entity could pass no parent's filters, and naturally, you also shouldn't have it in your branch.

But if you need to set an entity locally, without `parent->branches` flow, use `branch.setLocal(entity)`, that will set and entity immediately to the branch and parent will not know about it. Ha ha.

## Start

```ts
const sm = new SystemManager({
    // key in your entities representing entity id
    idKey: "id",
    systems: [
        system1,
        system2,
        ...restSystems,
    ]
});

sm.start();
```

## Async

You could set an entity at anytime, and all systems that need it will update.

# API
There is a quick overview of API.

## EntitManager
### Create
```ts
const em = new EntityManager({
    idKey: "id", // default: "id", member in entity to store id
    parent: new EntityManager(), // default: null
    groups: { // default: {}
        all: () => true, // register new group "all" accepting all entities
        users: entity => typeof entity.name === "string", // group that filters entities a bit
        mapped: entity => ({ ...entity, isUser: tue }), // group that maps entities
    }
});
```

### Branch
```ts
// create a branch
const branch = em.branch({
    groups: {
        all: () => false, // somewhy create a forever empty group
    }
});
```

### Groups
```ts
// register new group
branch.group("test", () => true);

// register a bunch of groups
branch.groupMany({
    test2: () => true,
    test3: () => true,
});

// unregister a group
branch.ungroup("test");

// get groups
branch.getGroups();
// or
branch.groups;
```

### Setting/unsetting
```ts
// start setting flow from the top level parent
branch.set({
    id: EntityManager.generateId(),
    name: "Test",
});

// set a bunch of entities
branch.setMany([
    {
        id: EntityManager.generateId(),
        name: "Test",
    },
    {
        id: EntityManager.generateId(),
        name: "Test2",
    }
]);

// set directly, omitting parent
branch.setLocal();

// start unsetting flow from the top level parent
branch.unset(entity);
branch.unset(entity.id);

// unset directly, omitting parent
branch.unsetLocal();
```

### Parent
```ts
// set a branch parent directly
// will detach the branch from a previous parent if any
branch.setParent(new EntityManager<any>());

// unset current parrent if any
branch.unsetParent();
```

### Events
```ts
// subscribe to set/unset event
branch.on(EEntityManagerEventTypes.set, entity => {}, thisArg);
branch.on(EEntityManagerEventTypes.unset, entity => {}, thisArg);

// subscribe to update event - an event firing after setMany or unsetMany
const listenerId = branch.on(EEntityManagerEventTypes.update, () => {}, thisArg);

// unsubscribe
branch.off(listenerId);
```

## SystemManager

### Create

```ts
const sm = new SystemManager({ idKey: "id" });
```

### Add systems
```ts
sm.add(system);
sm.addMany([...systems]);
```

### Start/stop

```ts
sm.start();
sm.stop();
```

## EntityList

List of entities. `EntityManager's` `Groups` are represented by `EntityList`.

(also, `EntityManager` uses `EntitList` to store entities, groups etc)

### Create
```ts
const el = new EntityList<any>({
    id: "listId",
    idKey: "id",
});
```

### Set/unset
```ts
el.set({
    id: EntityManager.generateId(),
    name: "Test",
});

el.unset({ id: entity.id });
el.unset(entity.id);
```

### Get
```ts
const entity = el.get({ id: entity.id });
const entity = el.get(entity.id);
```

### toArray/toObject
```ts
const arr = el.toArray();
const obj = el.toObject();

```


