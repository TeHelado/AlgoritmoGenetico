import * as _ from 'lodash';

export class Genetico {

    private poblacion = [];
    private individuos: number;
    private variables;
    private max_generaciones: number;
    private desviacion: number;
    private desviacionActual: number;
    private pMutacion: number;
    private pCruza: number;
    private funcion;
    private obj:string;

    private mejores;

    constructor(individuos: number, variables, max_generaciones: number, desviacion: number, pMutacion: number, pCruza: number, obj:string, funcion) {

        this.individuos = individuos;
        this.variables = variables;
        this.max_generaciones = max_generaciones;
        this.desviacion = desviacion;
        this.pMutacion = pMutacion;
        this.pCruza = pCruza;
        this.obj = obj;
        this.funcion = funcion;

        // obj === 'min' ? this.mejores = () => _.chain(this.poblacion).sortBy('aptitud').value() : this.mejores = () => _.chain(this.poblacion).sortBy('aptitud').reverse().value();
        obj === 'min' ? this.mejores = () => this.poblacion.sort((a,b)=>a.aptitud-b.aptitud) : this.mejores = () => this.poblacion.sort((a,b)=>b.aptitud-a.aptitud)
        this.desviacionActual = Infinity;
        for (let i = 0; i < individuos; i++) {
            this.poblacion.push({
                cromosoma: undefined,
                fenotipo: undefined,
                aptitud: undefined
            });            
        }
        this.calcData(_.map(this.generarPoblacion(individuos, _.sumBy(variables, 'size')),(o) => {return {cromosoma: o} }));
    }


    //Genera primer población random
    //Recibe el número de individuos que tendrá la población
    //Recibe el numero de bits que será cada individuo
    private generarPoblacion(sujetos, bits) {
        var poblacion = [];
        for (var i = 0; i < sujetos; i++) {
            const individuo = [];
            for (var j = 0; j < bits; j++) {
                individuo.push( Math.round(Math.random()));
            }
            poblacion.push(individuo);
        }
        return poblacion;

    }

    //El fenotipo recibe el individio que es un renglon de la matriz de población inicial
    //Recibe rmin que es el rango minimo que puede tomar
    //Recibe rmax que es el rango máimo que puede tomar
    private fenotipo(individuo) {
        const fenotipos = [];
        for (let i = 0, j=0,n=this.variables.length; i < n; i++) {
            let actual = individuo.slice(j, this.variables[i].size+j);
            // //Llega como vector de números y se pasa a string
            //Se pasa de binario a decimal para poder aplicar la formula
            var digit = parseInt(actual.join(""), 2);

            //Teniendo el decimal se aplica la formula para tener el valor en el rango
            fenotipos.push(((this.variables[i].rMax - this.variables[i].rMin) / ((Math.pow(2, actual.length)) - 1)) * digit + this.variables[i].rMin);
            j+=this.variables[i].size;
        }
        return fenotipos;
    }

    //Ejecuta la funcion deseada
    private evaluarAptitud(valFenotipo) {
        return this.funcion(valFenotipo);
    }

    //funcion para tener a los individuos con mejor aptitud, saca al mejor 40% de los individios de la generación
    //recibe los rangos rmin y rmax para sacar las aptitudes
    // private mejores() {
    //     return _.chain(this.poblacion).sortBy('aptitud').reverse().value();
    // }

    //Funcion de torneo
    //Recibe la población para hacer el random y selecciona al mejor, tomando en cuenta la maximización del problema
    private torneo() {
        //Saca los valores random para los individuos que competiran para cruza
        var randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        var player1 = randomRange(0, this.poblacion.length -1);
        var player2 = randomRange(0, this.poblacion.length -1);

        //Saca la aptitud de los individuos para saber cual es mejor
        if (this.poblacion[player1].aptitud > this.poblacion[player2].aptitud) {
            return this.poblacion[player1];
        } else {
            return this.poblacion[player2];
        }
    }

    //Hace el cruce entre los 2 individuos
    //Recibe el padre1 que cruzará, el padre2 que cruzará y el punto de corte
    private cruza(pCruza) {
        // var padre1 = _.cloneDeep(this.torneo());
        // var padre2 = _.cloneDeep(this.torneo());
        var padre1 = this.torneo();
        var padre2 = this.torneo();
        padre1 = {cromosoma: this.torneo().cromosoma.slice(), fenotipo: this.torneo().fenotipo.slice(), aptitud: this.torneo().aptitud}
        padre2 = {cromosoma: this.torneo().cromosoma.slice(), fenotipo: this.torneo().fenotipo.slice(), aptitud: this.torneo().aptitud}

        if (Math.random() > pCruza) {
            return [padre1, padre2];
        }       


        const hijo1 = [];
        const hijo2 = [];
        for (let i = 0, n=this.variables.length, j=0; i < n; i++) {
            const e = this.variables[i];
            hijo1.push(padre1.cromosoma.slice(j, e.size+j));
            hijo2.push(padre2.cromosoma.slice(j, e.size+j));
            j+=e.size;
        }

        let tmp = [];
        let tmp2 = [];
        for (let i = 0, n=hijo1.length; i < n; i++) {
            tmp = tmp.concat(hijo1[i].slice(0, Math.round(this.variables[i].size/2)));
            tmp = tmp.concat(hijo2[i].slice(Math.round(this.variables[i].size/2), this.variables[i].size));
            
            tmp2 = tmp2.concat(hijo2[i].slice(0, Math.round(this.variables[i].size/2)));
            tmp2 = tmp2.concat(hijo1[i].slice(Math.round(this.variables[i].size/2), this.variables[i].size));
        }


        // const f = this.fenotipo(tmp);
        // const f2 = this.fenotipo(tmp2)
        // return [{cromosoma: tmp, fenotipo: f, aptitud: this.evaluarAptitud(f)}, {cromosoma: tmp2, fenotipo: f2, aptitud: this.evaluarAptitud(f2)}];
        return [{cromosoma: tmp, fenotipo: undefined, aptitud: undefined}, {cromosoma: tmp2, fenotipo: undefined, aptitud: undefined}];
    }


    //Funcion para la mutación de los hijos en cada uno de sus alelos
    private mutacion(hijos, pMutacion) {
        //Recorre a cada uno de los alelos de los hijos
        for (var i = 0; i < hijos.length; i++) {
            for (var j = 0; j < hijos[i].cromosoma.length; j++) {
                //Si tienen un 1 se pasa a 0 y viceversa
                if ( Math.random() < pMutacion) {
                    hijos[i].cromosoma[j] = (1 + hijos[i].cromosoma[j])%2;
                }
            }
            var f = this.fenotipo(hijos[i].cromosoma);
            hijos[i].fenotipo = f;
            hijos[i].aptitud = this.evaluarAptitud(f);
        }
        return hijos;
    }

    // https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
    private desviacionEstandar(values) {
        const average = (data) => {
            var sum = data.reduce(function (sum, value) {
                return sum + value;
            }, 0);

            var avg = sum / data.length;
            return avg;
        }
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

    public solve() {
        let generacion = 0;
        //Los mejores de la población y pasan a la sig generación automaticamente 
        this.poblacion = this.mejores();
        for (generacion; generacion < this.max_generaciones && this.desviacionActual > this.desviacion; generacion++) {
            
            
            //Toma los hijos haciendo las cruzas de los faltantes para completar la generación
            var hijos = [];
            var cross;
            for (var i = 0; i < (Math.ceil(((this.poblacion.length - 3) / 2))); i++) {
                cross = this.cruza(this.pCruza);
                hijos.push(cross[0]);
                hijos.push(cross[1]);
            }
            var mutados = this.mutacion(hijos, this.pMutacion);
            // var mutados = this.mutacion(_.takeRight(this.poblacion, this.poblacion.length-3), this.pMutacion);

            for (var k = 3; k < this.poblacion.length; k++) {
                this.poblacion[k] = mutados[k-3];
            }
            // console.time('mejores');
            // this.calcData(this.poblacion);
            this.poblacion = this.mejores();
            // console.timeEnd('mejores');
            this.desviacionActual = this.desviacionEstandar(_.map(this.poblacion, 'aptitud'));
        }
        return {
            poblacion: _.map(this.poblacion, 'cromosoma'),
            desviacion: this.desviacionActual,
            aptitud: _.map(this.poblacion, 'aptitud'),
            fenotipo: _.map(this.poblacion, 'fenotipo'),
            generacion: generacion
        };
    }

    private calcData(poblacion) {
        let f;
        for (let i = 0; i < poblacion.length; i++) {
            f = this.fenotipo(poblacion[i].cromosoma);
            this.poblacion[i].cromosoma = poblacion[i].cromosoma;
            this.poblacion[i].fenotipo = f;
            this.poblacion[i].aptitud = this.evaluarAptitud(f);
            // poblacionNueva.push({
            //     cromosoma: poblacion[i].cromosoma,
            //     fenotipo: f,
            //     aptitud: this.evaluarAptitud(f)
            // });
        }
    }
}