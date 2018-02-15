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
 * Creates the root scene (Two() object).
 * 
 * Translates the scene so that its center (0,0) matches with the center of the specified element.
 * 
 * @arg {float} width - Width of the scene (in pixels).
 * @arg {float} height - Height of the scene (in pixels).
 * @arg {DOM.Element} elem - The domElement that will contain the scene, usually a <div>. 
 * @returns {Two} - Root scene object.
 */
function initScene(width, height, elem) {

	var param = { sceneWidth: window.innerWidth, sceneHeight: window.innerHeight, width = 25, type: Two.Types.svg};
	var two = new Phy(param).appendTo(elem);

	// Create normalized percent units for the scene.
	dims = new Dimensions(two.width, two.height);
	Two.dims = dims;			// Store the dims 'Two' class (NOT in an instant, in the class itself which is globally accessible).

	// Translate scene so that its (0,0) matches with center of screen
	two.scene.translation.set(two.width / 2, two.height / 2);

	return two;
}


/**
 * Create the root scene, add the required elements, set up any animation and start rendering/looping.
 */
function setupScene() {

	var elem = document.getElementById('Scene');
	var two = initScene(window.innerWidth, window.innerHeight, elem);

	// TODO Store scene-width and height in axis-units in the global object to use instead of arbitrary widths (300)
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
