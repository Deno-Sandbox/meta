/**
 * Let's build a three dimensional space.
 */

import { meta } from './cube.ts';

let myMeta = new meta();


myMeta.generateRandomMeta(5, 5, 5, 500);


let cube1 = myMeta.getCube(0, 0, 0);
let cube2 = myMeta.getRandomCube()

console.log(myMeta.generateCubeRoad(cube1, cube2))

//cube power
console.log(myMeta.getCubePower(cube1));
console.log(myMeta.getCubePower(cube2));
