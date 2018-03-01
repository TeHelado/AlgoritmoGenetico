//Primer generación
//fenotipo
//aptitud
//mandar a los mejores a la nueva generación
//torneo
//cruce
//mutación
//generación nueva
//Repetir
var _ = require('lodash');

//Genera primer población random
//Recibe el número de individuos que tendrá la población
//Recibe el numero de bits que será cada individuo
function generarPoblacion(sujetos, bits){
	var poblacion = new Array (sujetos);
	for (var i = 0; i < sujetos; i++) {
		poblacion[i] = new Array(bits);
		for (var j = 0; j < bits; j++){
			
		poblacion[i][j] = Math.round(Math.random());
		}
	}
	return poblacion;

}


//El fenotipo recibe el individio que es un renglon de la matriz de población inicial
//Recibe rmin que es el rango minimo que puede tomar
//Recibe rmax que es el rango máimo que puede tomar
function fenotipo(individuo,rmin,rmax) {
	//Llega como vector de números y se pasa a string
	individuo = individuo.join("");
	
	//Se pasa de binario a decimal para poder aplicar la formula
	var digit = parseInt(individuo, 2);

	//Teniendo el decimal se aplica la formula para tener el valor en el rango
	var result = 0;
	result = ((rmax - rmin) / ((Math.pow(2,individuo.length))-1)) * digit + rmin;

	return result;
}


//Para este ejercicio la funcion es maximizar f(x) = x^3 - 4x^2 + x
function evaluarAptitud (valFenotipo) {
	return (Math.pow(valFenotipo,3)) - (4*(Math.pow(valFenotipo,2))) + valFenotipo;
}


//funcion para tener a los individuos con mejor aptitud, saca al mejor 40% de los individios de la generación
//recibe los rangos rmin y rmax para sacar las aptitudes
function mejores(poblacion, rmin, rmax) {
	//Se tiene una población temporal para poder evaluar los mejores sin repetirse
	var poblacionTemporal = _.cloneDeep(poblacion);
	var poblacionNueva = [];
	//Se hace el ciclo hasta que se complete el 40% de los elementos
	for (var i = 0; i < Math.ceil(poblacion.length*0.3); i++) {
		//Se toma al primero como el de la mejor aptitud para poder comparar después
		var mejor = evaluarAptitud(fenotipo(poblacionTemporal[0],rmin,rmax));
		var posicion = 0;
		//Se hace la comparación en otro ciclo
		for (var j = 1; j < poblacionTemporal.length; j++) {
			//Se evalua si es mejor el acutal o el que estaba como mejor
			if(evaluarAptitud(fenotipo(poblacionTemporal[j],rmin,rmax)) > mejor)
			{
				//Si es mejor se cambia el nuevo mejor y se guarda la posicion
				mejor = evaluarAptitud(fenotipo(poblacionTemporal[j],rmin,rmax));
				posicion = j;
			}
		}
		//Terminando el ciclo se pone en la población nueva al mejor
		poblacionNueva.push(poblacionTemporal[posicion]);
		//Se quita de la población temporal para que en la siguiente iteración no lo revise
		poblacionTemporal.splice(posicion,1);
	}
	return poblacionNueva;
}


//Funcion de torneo
//Recibe la población para hacer el random y selecciona al mejor, tomando en cuenta la maximización del problema
function torneo(poblacion, rmin, rmax) {
	//Saca los valores random para los individuos que competiran para cruza
	var player1 = Math.floor((Math.random() * poblacion.length-1) + 1);
	var aptitud1 = evaluarAptitud(fenotipo(poblacion[player1],rmin,rmax));
	//console.log("index 1: " + player1 + " valor: " + poblacion[player1] + " aptitud: " + aptitud1);
	var player2 = Math.floor((Math.random() * poblacion.length-1) + 1);
	var aptitud2 = evaluarAptitud(fenotipo(poblacion[player2],rmin,rmax));
	//console.log("index 2: " + player2 + " valor: " + poblacion[player2] + " aptitud: " + aptitud2);

	//Saca la aptitud de los individuos para saber cual es mejor
	if( aptitud1 > aptitud2 ){
		return poblacion[player1];
	}
	else{
		return poblacion[player2];
	}
}


//Hace el cruce entre los 2 individuos
//Recibe el padre1 que cruzará, el padre2 que cruzará y el punto de corte
function cruza(poblacion, puntoCorte, rmin, rmax, pCruza) {

	var padre1 = torneo(poblacion, rmin, rmax);
	var padre2 = torneo(poblacion, rmin, rmax);

	if (Math.random() > pCruza) {
		return [padre1, padre2];
	} 

	//console.log("Padre 1: " + padre1);
	//console.log("Padre 2: " + padre2);
	

    if (padre1.length < puntoCorte || padre2.length < puntoCorte) {
        throw("Punto de corte mayor a vector");
    }

    var hijo1 = padre1.slice(0, puntoCorte);
    hijo1 = hijo1.concat(padre2.slice(puntoCorte, padre2.length));
    var hijo2 = padre2.slice(0, puntoCorte);
    hijo2 = hijo2.concat(padre1.slice(puntoCorte, padre2.length));

    return [hijo1, hijo2];
}


//Funcion para la mutación de los hijos en cada uno de sus alelos
function mutacion(hijos, pMutacion) {
	var r = 0;	
	//Recorre a cada uno de los alelos de los hijos
	for (var i = 0; i < hijos.length; i++) {		
		for (var j = 0; j < hijos[i].length; j++) {
			//Valor r random que dice si se mutan o no
			r = Math.random();
			//Si tienen un 1 se pasa a 0 y viceversa
			if (r < pMutacion) {
				if (hijos[i][j] == 0) {
					hijos[i][j] = 1;
				}
				else{
					hijos[i][j] = 0;
				}
			}
		}
	}

	return hijos;
}

// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
function desviacionEstandar(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}


// 0.0646049
/*------------------------------------------------------MAIN------------------------------------------------------*/

var max_iteraciones = 1000000;

var poblacion = generarPoblacion(8,16);
//var poblacion = [[0,1,1,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,0],[1,1,0,1,0,1],[1,0,0,1,0,1],[1,0,0,0,1,0],[1,0,0,1,0,1],[1,1,0,0,1,1,]];
var desviacion = Infinity;
for (let generacion = 0; generacion < max_iteraciones; generacion++) { // ?
	if (desviacion <= 0.03) {
		console.log('\x1B[2J');
		console.log(`Desviacion ${desviacion} alcanzada en ${generacion} iteraciones`);
		break;
	} else {
		//console.log('\x1B[2J');
		//console.log('Desviacion: ', desviacion);
	}
	if (generacion == max_iteraciones -1) {
		console.log('\x1B[2J');
		console.log(`\nMaximo de iteraciones alcanzado (${generacion}) con desviacion de ${desviacion}`);
	} 
	
	//console.log("\n----------POBLACIÓN INICIAL------");
	//console.log(poblacion);

	//Rango mínimo para usar reales
	var rmin = -2;

	//Rango máximo para usar reales
	var rmax = 3;

	//Probabilidad de mutación
	var pMutacion = 0.5;

	//Probabilidad de cruza
	var pCruza = 0.8;

	/*//Ver el fenotipo y aptitud de cada individuo
	for (var index = 0; index < poblacion.length; index++) {
		console.log("\n");
		console.log(poblacion[index]);
		
		var valFenotipo = fenotipo(poblacion[index],rmin,rmax)
		console.log("Valor del fenotipo " + valFenotipo);	

		var aptitud = evaluarAptitud(valFenotipo);
		console.log("Aptitud: " + aptitud);	
	}*/


	//Los mejores de la población y pasan a la sig generación automaticamente
	var poblacionNueva = mejores(poblacion,rmin,rmax); /*?.*/
	/*console.log("\n------POBLACIÓN NUEVA PASANDO A LOS MEJORES---------");
	console.log(poblacionNueva);*/


	//Toma los hijos haciendo las cruzas de los faltantes para completar la generación
	//console.log("\n-----------HIJOS-----------");
	var hijos = [];
	var cross;
	for (var i = 0; i < (Math.ceil(((poblacion.length - poblacionNueva.length)/2))); i++) {
		cross = cruza(poblacion, 3, rmin, rmax, pCruza);
		hijos.push(cross[0]);
		hijos.push(cross[1]);	
	}
	//console.log(hijos);

	//console.log("\n-----------HIJOS MUTADOS---------");
	var mutados = mutacion(hijos,pMutacion);
	//console.log(mutados);


	faltantes = poblacion.length-poblacionNueva.length;
	for (var k = 0; k < faltantes; k++) {
		poblacionNueva.push(mutados[k]);	
	}
	//console.log("\n------POBLACIÓN NUEVA LLENANDOLOS CON LOS MUTADOS---------");
	//console.log(poblacionNueva);
	//console.log("\n");

	poblacion = _.cloneDeep(poblacionNueva);
	//console.log("\n\n");
	//console.log('\n----------Aptitud-----------------');
	var a = [];
	poblacion.forEach(e => {
		a.push(evaluarAptitud(fenotipo(e,rmin,rmax)));
	});
	desviacion = desviacionEstandar(a);
	// console.log('\n----------desviación-----------------');
	// console.log(desviacion);
}

	console.log('\n----------Aptitud-----------------');
	var a = [];
	poblacion.forEach((e,i) => {
		a.push(evaluarAptitud(fenotipo(e,rmin,rmax)));
		console.log(i, a[a.length-1]);
	});
	// desviacion = desviacionEstandar(a);
	// console.log('\n----------desviación-----------------');
	// console.log(desviacion);