import { EventEmitter } from "./EventEmitter";

const ee = new EventEmitter<string>();

ee.on("set", data => {
    console.log("its data", data);
});

const id = ee.on("set", data => {
    console.log("its data 2", data);
});

ee.off(id);
ee.clear();

ee.emit("set", "hi");
