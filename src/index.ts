import { EntityList, EEntityListEventTypes } from "./EntityList";

const el = new EntityList();

el.on(EEntityListEventTypes.set, entity => {
    console.log("entity", entity);
});
el.on(EEntityListEventTypes.unset, entity => {
    console.log("unset entity", entity);
});

el.set({
    name: "Vasyl",
});

const e2 = el.set({
    name: "Vasyl Again",
});

el.unset(e2);

el.set({
    name: "Vasyl",
});


console.log(el);