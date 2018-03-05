"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genetico_1 = require("./genetico");
const _ = require("lodash");
// const config = {
//     individuos: 10,
//     variables : [
//         {
//             rMin: -2,
//             rMax: 3,
//             size: 16
//         }
//     ],
//     max_generaciones: 10000,
//     desviacion: 0.05,
//     pMutacion: 0.8,
//     pCruza: 0.5,
//     obj: 'max',
//     funcion: (x) => {
//         return Math.pow(x[0], 3) - 4 * Math.pow(x[0], 2) + x[0];
//     }
// }
//problema 6
// const config = {
//     individuos: 25,
//     variables : [
//         {rMin: -10, rMax: 10, size: 32},
//         {rMin: -10, rMax: 10, size: 32}
//     ],
//     max_generaciones: 100000,
//     desviacion: 0.5,
//     pMutacion: 0.7,
//     pCruza: 0.9,
//     obj: 'min',
//     funcion: (x) => {
//         let r = Math.abs(x[0]*Math.sin(x[0]) + 0.1*x[0]);
//         for (let i = 1; i < config.variables.length; i++) {
//             r += Math.abs(x[i]*Math.sin(x[i]) + 0.1*x[i]);
//         }
//         return r
//     }
// }
// problema 7
// const config = {
//     individuos: 20,
//     variables : [
//         {rMin: 0, rMax: 10, size: 16},
//         {rMin: 0, rMax: 10, size: 16},
//         {rMin: 0, rMax: 10, size: 16},
//         {rMin: 0, rMax: 10, size: 16}
//     ],
//     max_generaciones: 10000,
//     desviacion: 0.5,
//     pMutacion: 0.2,
//     pCruza: 0.8,
//     obj: 'max',
//     funcion: (x) => {
//         let r = Math.sqrt(x[0]) * Math.sin(x[0]);
//         for (let i = 1; i < config.variables.length; i++) {
//             r *=Math.sqrt(x[i]) * Math.sin(x[i]);
//         }
//         return r
//     }
// }
// //problama 8   nope
// const config = {
//     individuos: 20,
//     variables : [
//         {rMin: -0.25, rMax: 0.25, size: 32},
//         {rMin: 0.01, rMax: 2.5, size: 32},
//         {rMin: 0.01, rMax: 2.5, size: 32}
//     ],
//     max_generaciones: 50000,
//     desviacion: 0.5,
//     pMutacion: 0.4,
//     pCruza: 0.9,
//     obj: 'min',
//     funcion: (x) => {
//         const y = [0.14, 0.18, 0.22, 0.25, 0.29, 0.32, 0.35, 0.39, 0.37, 0.58, 0.73, 0.96, 1.34, 2.10, 4.39];
//         let v = 16;
//         let w = Math.min(0, v);
//         let r = Math.pow((y[0] - x[0] - 0) / (v * x[1] + w * x[2]), 2);
//         for (let i = 2; i <= 15; i++) {
//             v = 16-i;
//             w = Math.min(i, v);
//             r +=  Math.pow((y[i-1] - x[0] - i) / (v * x[1] + w * x[2]), 2);
//         }
//         return r;
//     }
// }
//problema 9
// const config = {
//     individuos: 20,
//     variables : [
//         {rMin: -500, rMax: 500, size: 16},
//         {rMin: -500, rMax: 500, size: 16}
//     ],
//     max_generaciones: 10000,
//     desviacion: 0.5,
//     pMutacion: 0.2,
//     pCruza: 0.8,
//     obj: 'min',
//     funcion: (x) => {
//         let r = Math.abs(Math.pow(x[0], 2) + Math.pow(x[1], 2) + x[0]*x[1]) + Math.abs(Math.sin(x[0])) + Math.abs(Math.cos(x[1]));
//         return r
//     }
// }
// reinas
const config = {
    individuos: 10,
    variables: [
        { rMin: -8, rMax: 8, size: 32 },
        { rMin: -8, rMax: 8, size: 32 },
        { rMin: -8, rMax: 8, size: 32 },
        { rMin: -8, rMax: 8, size: 32 },
        { rMin: -8, rMax: 8, size: 32 },
        { rMin: -8, rMax: 8, size: 32 },
        { rMin: -8, rMax: 8, size: 32 },
        { rMin: -8, rMax: 8, size: 32 }
    ],
    max_generaciones: 10000,
    desviacion: 0.5,
    pMutacion: 0.1,
    pCruza: 0.9,
    obj: 'max',
    funcion: (x) => {
        // console.log(x);
        // throw 'x';
        return _.sum(x);
    }
};
// const spinner = ora('Loading unicorns').start();
const g = new genetico_1.Genetico(config.individuos, config.variables, config.max_generaciones, config.desviacion, config.pMutacion, config.pCruza, config.obj, config.funcion);
console.time("evaluar");
const r = g.solve();
// spinner.stop();
console.log(`Generación: ${r.generacion}\tDesviación: ${r.desviacion}`);
console.log(`i\tfenotipo\t\taptitud`);
for (let i = 0; i < config.individuos; i++) {
    console.log(i + '  ', r.fenotipo[i] + '   ', r.aptitud[i]);
}
console.timeEnd("evaluar");
