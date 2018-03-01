EvaluarAptitud (fenotipo, (fenotipo) => {
	return 2+2*fenotipo;
});

function EvaluarAptitud (fenotipo , formula) {
	return formula(fenotipo);
}