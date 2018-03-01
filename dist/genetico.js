"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Genetico {
    constructor(individuos, variables, max_generaciones, desviacion, pMutacion, pCruza, obj, funcion) {
        this.individuos = individuos;
        // let step = 0;
        // variables.forEach(e => {
        //     e.start = step;
        //     step += e.size;
        //     e.end = step-1;
        // });
        // console.log(variables);
        this.variables = variables;
        this.max_generaciones = max_generaciones;
        this.desviacion = desviacion;
        this.pMutacion = pMutacion;
        this.pCruza = pCruza;
        this.obj = obj;
        this.funcion = funcion;
        this.desviacionActual = Infinity;
        this.poblacion = this.generarPoblacion(individuos, _.sumBy(variables, 'size'));
    }
    //Genera primer población random
    //Recibe el número de individuos que tendrá la población
    //Recibe el numero de bits que será cada individuo
    generarPoblacion(sujetos, bits) {
        var poblacion = [];
        for (var i = 0; i < sujetos; i++) {
            const individuo = [];
            for (var j = 0; j < bits; j++) {
                individuo.push(Math.round(Math.random()));
            }
            poblacion.push(individuo);
        }
        return poblacion;
    }
    //El fenotipo recibe el individio que es un renglon de la matriz de población inicial
    //Recibe rmin que es el rango minimo que puede tomar
    //Recibe rmax que es el rango máimo que puede tomar
    fenotipo(individuo, variables) {
        const fenotipos = [];
        const individuos = [];
        variables.forEach(e => {
            individuos.push(_.take(individuo, e.size));
            individuo = _.slice(individuo, e.size);
        });
        individuos.forEach((e, i) => {
            //Llega como vector de números y se pasa a string
            individuo = e.join("");
            //Se pasa de binario a decimal para poder aplicar la formula
            var digit = parseInt(individuo, 2);
            //Teniendo el decimal se aplica la formula para tener el valor en el rango
            fenotipos.push(((variables[i].rMax - variables[i].rMin) / ((Math.pow(2, individuo.length)) - 1)) * digit + variables[i].rMin);
        });
        return fenotipos;
    }
    //Ejecuta la funcion deseada
    evaluarAptitud(valFenotipo) {
        return this.funcion(valFenotipo);
    }
    //funcion para tener a los individuos con mejor aptitud, saca al mejor 40% de los individios de la generación
    //recibe los rangos rmin y rmax para sacar las aptitudes
    mejores(poblacion, variables) {
        //Se tiene una población temporal para poder evaluar los mejores sin repetirse
        var poblacionTemporal = _.cloneDeep(poblacion);
        var poblacionNueva = [];
        //Se hace el ciclo hasta que se complete el 40% de los elementos
        for (var i = 0; i < Math.ceil(poblacion.length * 0.3); i++) {
            //Se toma al primero como el de la mejor aptitud para poder comparar después
            var mejor = this.evaluarAptitud(this.fenotipo(poblacionTemporal[0], variables));
            var posicion = 0;
            //Se hace la comparación en otro ciclo
            for (var j = 1; j < poblacionTemporal.length; j++) {
                //Se evalua si es mejor el acutal o el que estaba como mejor
                const apt = this.evaluarAptitud(this.fenotipo(poblacionTemporal[j], variables));
                if (this.obj === 'max' ? apt > mejor : apt < mejor) {
                    //Si es mejor se cambia el nuevo mejor y se guarda la posicion
                    mejor = this.evaluarAptitud(this.fenotipo(poblacionTemporal[j], variables));
                    posicion = j;
                }
            }
            //Terminando el ciclo se pone en la población nueva al mejor
            poblacionNueva.push(poblacionTemporal[posicion]);
            //Se quita de la población temporal para que en la siguiente iteración no lo revise
            poblacionTemporal.splice(posicion, 1);
        }
        return poblacionNueva;
    }
    //Funcion de torneo
    //Recibe la población para hacer el random y selecciona al mejor, tomando en cuenta la maximización del problema
    torneo(poblacion, variables) {
        //Saca los valores random para los individuos que competiran para cruza
        var player1 = Math.floor((Math.random() * poblacion.length - 1) + 1);
        var aptitud1 = this.evaluarAptitud(this.fenotipo(poblacion[player1], variables));
        //console.log("index 1: " + player1 + " valor: " + poblacion[player1] + " aptitud: " + aptitud1);
        var player2 = Math.floor((Math.random() * poblacion.length - 1) + 1);
        var aptitud2 = this.evaluarAptitud(this.fenotipo(poblacion[player2], variables));
        //console.log("index 2: " + player2 + " valor: " + poblacion[player2] + " aptitud: " + aptitud2);
        //Saca la aptitud de los individuos para saber cual es mejor
        if (aptitud1 > aptitud2) {
            return poblacion[player1];
        }
        else {
            return poblacion[player2];
        }
    }
    //Hace el cruce entre los 2 individuos
    //Recibe el padre1 que cruzará, el padre2 que cruzará y el punto de corte
    cruza(poblacion, variables, pCruza) {
        var padre1 = this.torneo(poblacion, variables);
        var padre2 = this.torneo(poblacion, variables);
        if (Math.random() > pCruza) {
            return [padre1, padre2];
        }
        const fenotipos = [];
        const hijo1 = [];
        const hijo2 = [];
        variables.forEach(e => {
            hijo1.push(_.take(padre1, e.size));
            padre1 = _.slice(padre1, e.size);
            hijo2.push(_.take(padre2, e.size));
            padre2 = _.slice(padre2, e.size);
        });
        let tmp = [];
        let tmp2 = [];
        for (let i = 0; i < hijo1.length; i++) {
            tmp = tmp.concat(hijo1[i].slice(0, Math.round(variables[i].size / 2)));
            tmp = tmp.concat(hijo2[i].slice(Math.round(variables[i].size / 2), variables[i].size));
            tmp2 = tmp.concat(hijo2[i].slice(0, Math.round(variables[i].size / 2)));
            tmp2 = tmp2.concat(hijo1[i].slice(Math.round(variables[i].size / 2), variables[i].size));
        }
        return [tmp, tmp2];
    }
    //Funcion para la mutación de los hijos en cada uno de sus alelos
    mutacion(hijos, pMutacion) {
        //Recorre a cada uno de los alelos de los hijos
        for (var i = 0; i < hijos.length; i++) {
            for (var j = 0; j < hijos[i].length; j++) {
                //Si tienen un 1 se pasa a 0 y viceversa
                if (Math.random() < pMutacion) {
                    if (hijos[i][j] == 0) {
                        hijos[i][j] = 1;
                    }
                    else {
                        hijos[i][j] = 0;
                    }
                }
            }
        }
        return hijos;
    }
    // https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
    desviacionEstandar(values) {
        const average = (data) => {
            var sum = data.reduce(function (sum, value) {
                return sum + value;
            }, 0);
            var avg = sum / data.length;
            return avg;
        };
        var avg = average(values);
        var squareDiffs = values.map(function (value) {
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });
        var avgSquareDiff = average(squareDiffs);
        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }
    solve() {
        let generacion = 0;
        for (generacion; generacion < this.max_generaciones; generacion++) {
            if (this.desviacionActual <= this.desviacion) {
                console.log('\x1B[2J');
                console.log(`Desviacion ${this.desviacionActual} alcanzada en ${generacion} iteraciones`);
                break;
            }
            if (generacion == this.max_generaciones - 1) {
                console.log('\x1B[2J');
                console.log(`\nMaximo de iteraciones alcanzado`);
            }
            //Los mejores de la población y pasan a la sig generación automaticamente
            var poblacionNueva = this.mejores(this.poblacion, this.variables);
            //Toma los hijos haciendo las cruzas de los faltantes para completar la generación
            var hijos = [];
            var cross;
            for (var i = 0; i < (Math.ceil(((this.poblacion.length - poblacionNueva.length) / 2))); i++) {
                cross = this.cruza(this.poblacion, this.variables, this.pCruza);
                hijos.push(cross[0]);
                hijos.push(cross[1]);
            }
            var mutados = this.mutacion(hijos, this.pMutacion);
            const faltantes = this.poblacion.length - poblacionNueva.length;
            for (var k = 0; k < faltantes; k++) {
                poblacionNueva.push(mutados[k]);
            }
            this.poblacion = _.cloneDeep(poblacionNueva);
            var a = [];
            this.poblacion.forEach(e => {
                a.push(this.evaluarAptitud(this.fenotipo(e, this.variables)));
            });
            this.desviacionActual = this.desviacionEstandar(a);
        }
        return {
            poblacion: this.poblacion,
            desviacion: this.desviacionActual,
            aptitud: this.getAptitud(),
            fenotipo: this.getFenotipo(),
            generacion: generacion
        };
    }
    getAptitud() {
        if (!this.poblacion) {
            throw "No hay población.";
        }
        var a = [];
        this.poblacion.forEach(e => {
            a.push(this.evaluarAptitud(this.fenotipo(e, this.variables)));
        });
        return a;
    }
    getFenotipo() {
        if (!this.poblacion) {
            throw "No hay población.";
        }
        var a = [];
        this.poblacion.forEach(e => {
            a.push(this.fenotipo(e, this.variables));
        });
        return a;
    }
}
exports.Genetico = Genetico;
