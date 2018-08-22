import { EntityList } from "./Entity/EntityList";

const el = new EntityList();
console.log(el);

el.group("test", () => true);
el.group("test2", () => false);

el.set({
    name: "Joshn"
});

console.log(el);

// import { List } from "./Entity/List";

// setTimeout(() => {
//     const max = 100;
//     const arr = [];
//     let l: any;

//     // for(let i = 0; i < 1; i++) {
//         console.time("array push");
//         for(let i = 0; i < max; i++) {
//             arr.push({
//                 id: `${i}`,
//                 name: "Vasyl",
//                 fullname: `Vasyl, ${i}`,
//                 age: 13213123123123123123,
//             });
//         }
//         console.timeEnd("array push");
//     // }

//     // for(let i = 0; i < 1; i++) {
//         l = new EntityList;
//         console.time("l set");
//         for(let i = 0; i < max; i++) {
//             l.set({
//                 id: `${i}`,
//                 name: "Vasyl",
//                 fullname: `Vasyl, ${i}`,
//                 age: 13213123123123123123,
//             });
//         }
//         console.timeEnd("l set");
//     // }

//     // for(let i = 0; i < 4; i++) {
//     //     console.time("l get");
//     //     for(let i = 0; i < max; i++) {
//     //         l.get({
//     //             id: `${i}`,
//     //             name: "Vasyl",
//     //         });
//     //     }
//     //     console.timeEnd("l get");
//     // }

//     // for(let i = 0; i < 4; i++) {
//     //     console.time("array find");
//     //     for(let i = 0; i < max; i++) {
//     //         arr.find((v: any) => v.id === i.toString());
//     //     }
//     //     console.timeEnd("array find");
//     // }

// }, 500);
