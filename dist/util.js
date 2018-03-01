"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplicatoria = (f, x, D) => {
    const replaceAll = (str, find, replace) => {
        return str.replace(new RegExp(find, 'g'), replace);
    };
    let g = replaceAll(f, 'x', x[0]);
    let r = eval(g);
    for (let i = 1; i < D; i++) {
        g = replaceAll(f, 'x', x[i]);
        r *= eval(g);
    }
    return r;
};
exports.sumatoria = (f, x, D) => {
    const replaceAll = (str, find, replace) => {
        return str.replace(new RegExp(find, 'g'), replace);
    };
    let g = replaceAll(f, 'x', x[0]);
    let r = eval(g);
    for (let i = 1; i < D; i++) {
        g = replaceAll(f, 'x', x[i]);
        r += eval(g);
    }
    return r;
};
