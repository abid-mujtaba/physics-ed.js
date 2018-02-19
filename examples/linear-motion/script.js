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

	var param = {sceneWidth: window.innerWidth, sceneHeight: window.innerHeight, width: 25};
	var phy = new Phy(param).appendTo(elem);

	phy.makeXAxis(-15, 8, 2, 0.5).suppressZero();
	phy.makeYAxis(-6, 6, 1, 0.5).suppressZero();

	// Create particle as a circle
	var circle = phy.makeCircle(-11, 0, 0.15);
	circle.fill = 'black';

	// Render scene
	phy.update();
}


/**
 * Define a function that 


/** Start the animation when the window finishes loading. */
window.onload = init;
