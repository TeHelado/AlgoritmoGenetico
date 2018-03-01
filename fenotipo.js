var rmin = 2.2;
var rmax = 3.9;
var individuo = [0,1,1,0,1,0]; //26 2.09

individuo = individuo.join("");
console.log("individuo" + individuo);


var digit = parseInt(individuo, 2);
console.log("decimal: " + digit);

var result = 0;
result = ((rmax - rmin) / ((Math.pow(2,individuo.length))-1)) * digit + rmin;

console.log("result: " + result);

