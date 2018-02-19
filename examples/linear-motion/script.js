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

	var param = {sceneWidth: window.innerWidth, sceneHeight: window.innerHeight, width: 25, originX: 3.5};
	var phy = new Phy(param).appendTo(elem);

	phy.makeXAxis(-15, 8, 1).yshift(-1);

	// Create particle as a circle
	var particle = phy.makeCircle(-15, 0, 0.15);
	particle.fill = 'black';						// TODO: Add method .update to particle which is specified by user and called automatically. Time NOT framecount is passed to this method.
	phy.patch(particle);


	// Define the function that will be called when the scene is updated to create the animation.
	function update(frameCount) {

		var t = frameCount / 60.0;
		particle.position(pos(t), 0);
	}


	// Bind update() to the 'update' event so that it is called automatically at 60 fps 
	phy.bind('update', update);

	//phy.addToUpdate(particle);
	// Start animation
	phy.play();
}




/**
 * Define a function that gives the position of the particle as a function of time.
 */
function pos(t) {

	return -15 + t;
}


/** Start the animation when the window finishes loading. */
window.onload = init;
