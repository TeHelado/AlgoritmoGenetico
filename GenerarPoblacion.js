function GenerarPoblacion(sujetos, bits){
	var poblacion = new Array (sujetos);
	for (var i = 0; i < sujetos; i++) {
		poblacion[i] = new Array(bits);
		for (var j = 0; j < bits; j++){
			
		poblacion[i][j] = Math.round(Math.random());
		console.log("BLA");
		}
	}
	return poblacion;

}
console.log(GenerarPoblacion(2,7));