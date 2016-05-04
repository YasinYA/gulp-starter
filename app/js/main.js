function add(o, n) {
	return o + n
}

function substract(o, n) {
	return o - n
}

function multiple(o, n) {
	return o * n
}

function divide(o, n) {
	return o / n
}
document.getElementById("output").innerHTML = "1+1 =   " + add(1, 1) + "   2-1 =   " + substract(2, 1) + "    3*3 =   " + multiple(3, 3) + "   4/2 =    " + divide(4, 2) + " happy.";