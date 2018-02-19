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
	particle.fill = 'black';

	// Attach a function of time (associated with the first particle) to be called on each iteration
	particle.update = function (t) {
		
		this.position(-15 + t, 0);
	}


	var particle2 = phy.makeCircle(8, 1, 0.15);
	particle2.fill = 'blue';
	particle2.stroke = null;

	particle2.update = function(t) {

		this.position(8 - t, 1);
	}

	

	// Speed up animation
	phy.timeScale = 3;


	// Add all objects that need to be animated to the list of objects to update
	phy.addToUpdate(particle, particle2);

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
