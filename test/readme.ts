import { ECS } from "../src";

const em = new ECS.EntityManager();
const sm = new ECS.SystemManager(em);

sm.add({
    update(em) {
        em
            .filter(entity => entity.name === "Vasylko")
            .forEach(entity => {
                console.log(`Another one ${entity.name}!`);
            });
    }
});
