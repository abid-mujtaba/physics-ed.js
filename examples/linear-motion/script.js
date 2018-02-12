/** 
 * This script requires: 	two.js, physics-ed.js
 */

/** Global Variables */
var two;		// Two scene
var dims;		// Global Dimensions object that converts between percentage and actual pixel position values



/**
 * Initialize the entire animation.
 */
function init() {
	
	setupScene();
}
	

/**
 * Create the root scene, add the required elements, set up any animation and start rendering/looping.
 */
function setupScene() {

	var elem = document.getElementById('Scene');
	two = initScene(window.innerWidth, window.innerHeight, elem);
	dims = new Dimensions(two.width, two.height);

	// Add x-axis	
	var xAxis = makeXAxis(-8, 8, 2).suppressZero();
	var yAxis = makeYAxis(-4,4).suppressZero();

	two.add(xAxis);
	two.add(yAxis);

	// Render scene
	two.update();
}


/** Start the animation when the window finishes loading. */
window.onload = init;
