/** 
 * This script requires: 	two.js, physics-ed.js
 */


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
	var two = initScene(window.innerWidth, window.innerHeight, elem);

	// Add x-axis	
	var xAxis = makeXAxis(-15,8,1,300).suppressZero();
	var yAxis = makeYAxis(-3,3,1,0,xAxis.spacing).suppressZero();
	yAxis.xshift(3.5);

	two.add(xAxis);
	two.add(yAxis);

	// Render scene
	two.update();
}


/** Start the animation when the window finishes loading. */
window.onload = init;
