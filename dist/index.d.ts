import * as sm from "./SystemManager";
import * as em from "./EntityManager";
export declare namespace ECS {
    export import SystemManager = sm.SystemManager;
    export import ISystem = sm.ISystem;
    export import EntityManager = em.EntityManager;
    export import IEntity = em.IEntity;
    export import IEntityData = em.IEntityData;
    export import IEntityManagerListenerFn = em.IEntityManagerListenerFn;
    export import EEntityManagerEventTypes = em.EEntityManagerEventTypes;
}
