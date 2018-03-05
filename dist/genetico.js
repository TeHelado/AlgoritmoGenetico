"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Genetico {
    constructor(individuos, variables, max_generaciones, desviacion, pMutacion, pCruza, obj, funcion) {
        this.individuos = individuos;
        this.variables = variables;
        this.max_generaciones = max_generaciones;
        this.desviacion = desviacion;
        this.pMutacion = pMutacion;
        this.pCruza = pCruza;
        this.obj = obj;
        this.funcion = funcion;
        this.desviacionActual = Infinity;
        this.poblacion = this.calcData(_.map(this.generarPoblacion(individuos, _.sumBy(variables, 'size')), (o) => { return { cromosoma: o }; }));
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
    fenotipo(individuo) {
        const fenotipos = [];
        const individuos = [];
        this.variables.forEach(e => {
            individuos.push(_.take(individuo, e.size));
            individuo = _.slice(individuo, e.size);
        });
        individuos.forEach((e, i) => {
            //Llega como vector de números y se pasa a string
            individuo = e.join("");
            //Se pasa de binario a decimal para poder aplicar la formula
            var digit = parseInt(individuo, 2);
            //Teniendo el decimal se aplica la formula para tener el valor en el rango
            fenotipos.push(((this.variables[i].rMax - this.variables[i].rMin) / ((Math.pow(2, individuo.length)) - 1)) * digit + this.variables[i].rMin);
        });
        return fenotipos;
    }
    //Ejecuta la funcion deseada
    evaluarAptitud(valFenotipo) {
        return this.funcion(valFenotipo);
    }
    //funcion para tener a los individuos con mejor aptitud, saca al mejor 40% de los individios de la generación
    //recibe los rangos rmin y rmax para sacar las aptitudes
    mejores() {
        return _.chain(this.poblacion).sortBy('aptitud').takeRight(3).value();
    }
    //Funcion de torneo
    //Recibe la población para hacer el random y selecciona al mejor, tomando en cuenta la maximización del problema
    torneo() {
        //Saca los valores random para los individuos que competiran para cruza
        var player1 = Math.floor(Math.random() * (this.poblacion.length));
        var player2 = Math.floor(Math.random() * (this.poblacion.length));
        //Saca la aptitud de los individuos para saber cual es mejor
        if (this.poblacion[player1].aptitud > this.poblacion[player2].aptitud) {
            return this.poblacion[player1];
        }
        else {
            return this.poblacion[player2];
        }
    }
    //Hace el cruce entre los 2 individuos
    //Recibe el padre1 que cruzará, el padre2 que cruzará y el punto de corte
    cruza(pCruza) {
        var padre1 = _.cloneDeep(this.torneo());
        var padre2 = _.cloneDeep(this.torneo());
        if (Math.random() > pCruza) {
            return [padre1, padre2];
        }
        const fenotipos = [];
        const hijo1 = [];
        const hijo2 = [];
        this.variables.forEach(e => {
            hijo1.push(_.take(padre1.cromosoma, e.size));
            padre1.cromosoma = _.slice(padre1.cromosoma, e.size);
            hijo2.push(_.take(padre2.cromosoma, e.size));
            padre2.cromosoma = _.slice(padre2.cromosoma, e.size);
        });
        let tmp = [];
        let tmp2 = [];
        for (let i = 0; i < hijo1.length; i++) {
            tmp = tmp.concat(hijo1[i].slice(0, Math.round(this.variables[i].size / 2)));
            tmp = tmp.concat(hijo2[i].slice(Math.round(this.variables[i].size / 2), this.variables[i].size));
            tmp2 = tmp2.concat(hijo2[i].slice(0, Math.round(this.variables[i].size / 2)));
            tmp2 = tmp2.concat(hijo1[i].slice(Math.round(this.variables[i].size / 2), this.variables[i].size));
        }
        let f = this.fenotipo(tmp);
        padre1.cromosoma = tmp;
        padre1.fenotipo = f;
        padre1.aptitud = this.evaluarAptitud(f);
        f = this.fenotipo(tmp2);
        padre2.cromosoma = tmp2;
        padre2.fenotipo = f;
        padre2.aptitud = this.evaluarAptitud(f);
        return [padre1, padre2];
    }
    //Funcion para la mutación de los hijos en cada uno de sus alelos
    mutacion(hijos, pMutacion) {
        //Recorre a cada uno de los alelos de los hijos
        for (var i = 0; i < hijos.length; i++) {
            for (var j = 0; j < hijos[i].cromosoma.length; j++) {
                //Si tienen un 1 se pasa a 0 y viceversa
                if (Math.random() < pMutacion) {
                    hijos[i].cromosoma[j] = (1 + hijos[i].cromosoma[j]) % 2;
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
            var poblacionNueva = this.mejores();
            //Toma los hijos haciendo las cruzas de los faltantes para completar la generación
            var hijos = [];
            var cross;
            for (var i = 0; i < (Math.ceil(((this.poblacion.length - poblacionNueva.length) / 2))); i++) {
                cross = this.cruza(this.pCruza);
                hijos.push(cross[0]);
                hijos.push(cross[1]);
            }
            var mutados = this.mutacion(hijos, this.pMutacion);
            const faltantes = this.poblacion.length - poblacionNueva.length;
            for (var k = 0; k < faltantes; k++) {
                poblacionNueva.push(mutados[k]);
            }
            // console.log(_.map(poblacionNueva, (o) => o.cromosoma.length));
            // throw 'stop';
            this.poblacion = this.calcData(_.cloneDeep(poblacionNueva));
            console.time('mejores');
            this.desviacionActual = this.desviacionEstandar(_.map(this.poblacion, 'aptitud'));
            console.timeEnd('mejores');
        }
        return {
            poblacion: _.map(this.poblacion, 'cromosoma'),
            desviacion: this.desviacionActual,
            aptitud: _.map(this.poblacion, 'aptitud'),
            fenotipo: _.map(this.poblacion, 'fenotipo'),
            generacion: generacion
        };
    }
    calcData(poblacion) {
        const poblacionNueva = [];
        let f;
        for (let i = 0; i < poblacion.length; i++) {
            f = this.fenotipo(poblacion[i].cromosoma);
            poblacionNueva.push({
                cromosoma: poblacion[i].cromosoma,
                fenotipo: f,
                aptitud: this.evaluarAptitud(f)
            });
        }
        return poblacionNueva;
    }
}
exports.Genetico = Genetico;
