import * as sm from "./SystemManager";
import * as em from "./EntityManager";

export namespace ECS {
    export import SystemManager = sm.SystemManager;
    export import ISystem = sm.ISystem;

    export import EntityManager = em.EntityManager;
    export import EEntityManagerEventTypes = em.EEntityManagerEventTypes;
    export import IEntity = em.IEntity;
    export import IEntityData = em.IEntityData;
    export import TEntityManagerListenerFn = em.TEntityManagerListenerFn;
}

export default ECS;
