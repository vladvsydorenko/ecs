import { EntityList, EEntityListEventTypes } from "./SmartEntityList";

const el = new EntityList({});

el.on(EEntityListEventTypes.set, entity => {
    console.log(entity);
});

el.set({
    test: "Test"
});
const entity = el.set({
    name: "test",
});
el.unset(entity);

console.log(el);

const mapOperator = (entity: any, entities: any) => {
    if (entity !== 2) entities.set(entity);
};
