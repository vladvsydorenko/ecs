import { SystemManager } from "./SystemManager";
import { EntityManager, EEntityManagerEventTypes } from "./EntityManager";

const sm = new SystemManager({
    idKey: "id",
    systems: [
        {
            start(entities) {
                entities.groupMany({
                    all: () => true,
                });

                const entity = {
                    id: EntityManager.generateId(),
                    name: "Test",
                };
                entities.set(entity);
                entities.set({
                    ...entity,
                    name: "Not Test",
                });

                // let arr = [];
                // for (let i = 0; i < 100; i++) {
                //     arr.push({
                //         id: EntityManager.generateId(),
                //         name: `Test ${i}`,
                //     });
                // }
                // console.time("setMany");
                // entities.setMany(arr);
                // console.timeEnd("setMany");
            },
            update(entities) {
                console.log(entities.groups.all);
            }
        }
    ]
});

sm.start();
