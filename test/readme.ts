import { ECS } from "../src";

const em = new ECS.EntityManager();

em.on(ECS.EEntityManagerEventTypes.set, () => {

});