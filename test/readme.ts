import { EntityManager, SystemManager, IEntity } from "../src";

const em = new EntityManager();
const sm = new SystemManager(em);

sm.add({
    update(em) {
        em
            .filter(entity => entity.name === "Vasylko")
            .forEach(entity => {
                console.log(`Another one ${entity.name}!`);
            });
    }
});
