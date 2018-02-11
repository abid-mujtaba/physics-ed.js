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

	// Add axes	
	// Since we have two axes we suppress the zero tick and label to avoid the overlap
	var xAxis = makeXAxis(-5, 3).suppressZero();
	makeYAxis(-6, 6, 2, xpos = 1 * xAxis.spacing).suppressZero();		// Use the returned xspacing to shift the y-axis so that the zeros of the two axes align

	// Render scene
	two.update();
}


/** Start the animation when the window finishes loading. */
window.onload = init;
