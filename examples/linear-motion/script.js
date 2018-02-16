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


	// TODO Store scene-width and height in axis-units in the global object to use instead of arbitrary widths (300)
	// Add x-axis	
	var xAxis = makeXAxis(-15,8,1,300).suppressZero();
	var yAxis = makeYAxis(-3,3,1,0,xAxis.spacing).suppressZero();
	yAxis.xshift(3.5);

	phy.add(xAxis);
	phy.add(yAxis);

	// Render scene
	phy.update();
}


/** Start the animation when the window finishes loading. */
window.onload = init;
