import {
    Genetico
} from './genetico';

import * as _ from 'lodash';
import * as chalk from 'chalk';

const vars = (min, max, size, times) => {
    const arr = [];
    for (let i = 0; i < times; i++) {
        arr.push({rMin: min, rMax: max, size: size});
    }
    return arr;
}

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
//     desviacion: 0.000000005,
//     pMutacion: 0.9,
//     pCruza: 0.8,
//     obj: 'max',
//     funcion: (x) => {
//         return Math.pow(x[0], 3) - 4 * Math.pow(x[0], 2) + x[0];
//     }
// }

//problema 6
// const config = {
//     individuos: 10,
//     variables : [
//         {rMin: -10, rMax: 10, size: 32},
//         {rMin: -10, rMax: 10, size: 32}
//     ],
//     max_generaciones: 100000,
//     desviacion: 0.5,
//     pMutacion: 0.4,
//     pCruza: 0.8,
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
    variables : vars(1, 8, 10, 8),
    max_generaciones: 30000,
    desviacion: 0.05,
    pMutacion: 0.9,
    pCruza: 0.2,
    obj: 'min',
    funcion: (x) => {
        // console.log(_.sortedUniqBy(x, Math.floor));
        const col = _.chain(x).map((o) => Math.round(o)).uniq().value();
        if (col.length < x.length) {
            return x.length - col.length;
        }

        const pendiente = (x1, y1, x2, y2) => (y2 - y1) / (x2 - x1);

        for (let r = 0; r < x.length; r++) {
            for (let c = r+1; c < x.length; c++) {
                if (Math.abs(pendiente(r, col[r], c, col[c])) === 1) {
                    return 1;
                }
            }
        }

        return 0;

        
        /*
            6.764705882352941,5.117647058823529,3.003921568627451,1.4392156862745098,6.435294117647059,8,2.4,3.992156862745098
            7 5 3 1 6 8 2 4

            5.0627450980392155,2.6470588235294117,1.384313725490196,6.737254901960784,1.603921568627451,7.5058823529411764,6.352941176470588,4.486274509803922
            5 3 1 7 2 8 6 4

            4.403921568627451,6.243137254901961,1.3019607843137255,4.733333333333333,1.5490196078431373,7.890196078431372,2.674509803921569,7.12156862745098
            4 6 1 5 2 8 3 7
            
            10 reinas
             8.341176470588234,3.188235294117647,4.705882352941177,2.094117647058823,9.011764705882353,6.223529411764706,9.752941176470587,7.458823529411765,4.317647058823529,1.4941176470588236
             8 3 5 2 9 6 10 7 4 1
        */
    }
}

const g = new Genetico(config.individuos, config.variables, config.max_generaciones, config.desviacion, config.pMutacion, config.pCruza, config.obj, config.funcion);
console.time("evaluar");

const r = g.solve();
console.log(`Generación: ${r.generacion}\tDesviación: ${r.desviacion}`);
console.log(`i\tfenotipo\t\taptitud`);
for (let i = 0; i < config.individuos; i++) {
    if (i < 3)
        console.log((i)+'  ', (r.fenotipo[i])+'   ', (r.aptitud[i]));
    else
    console.log((i)+'  ', (r.fenotipo[i])+'   ', (r.aptitud[i]));
}
console.timeEnd("evaluar");
