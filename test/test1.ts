import { SystemManager } from "../src/SystemManager";
import { EntityManager } from "../src/EntityManager";

const em = new EntityManager();
const sm = new SystemManager(em);

em.set({
    name: "Vasylko"
});
em.set({
    name: "Vasylko2"
});

const id = sm.add({
    update(em: EntityManager) {
        const petryk = em.find(entity => {
            return entity.name === "Petryk";
        });
        if (petryk) {
            const vasylko = em.find(entity => {
                return entity.name === "Vasylko";
            });
            if (vasylko) {
                em.set({
                    ...vasylko,
                    name: "John"
                });
            }
        }
        console.log("updated", em);
    },
});

const id2 = sm.add({
    update(em: EntityManager) {
        const entity = em.find(entity => {
            return entity.name === "Vasylko2";
        });
        if (entity) {
            em.set({
                ...entity,
                name: "Petryk",
            });
        }
        console.log("updated 2", em);
    },
});

sm.start();
sm.stop();
