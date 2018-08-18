import { ECS } from "../src/index";

const sm: ECS.SystemManager = new ECS.SystemManager();

class Test implements ECS.ISystem {
    update() {}
}

