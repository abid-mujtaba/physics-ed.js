var two;
var dims;		// Global Dimensions object

// Requires: 	two.js
//				physics-ed.js


function init() {
	
	setupScene();
}
	

function setupScene() {

	var elem = document.getElementById('Scene');
	two = initScene(window.innerWidth, window.innerHeight, elem);
	dims = new Dimensions(two.width, two.height);

	// Add x-axis
	makeXAxis(-5, 3);

	// Render scene
	two.update();
}


window.onload = init;
