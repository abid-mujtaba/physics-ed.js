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

	// Set initial kinematic values
	particle.x = -15;
	particle.v = 0;
	particle.a = 1;		// 2 units per second squared
	particle.t = 0;

	// Attach a function of time (associated with the first particle) to be called on each iteration
	particle.update = function (t) {

		if (this.v < 0)		// Stopping condition
			return;

		// Define the acceleration of the particle as a function of time
		function a(t) {

			if (t < 2)
				return 2;
			else if (t < 5)
				return 0;
			else
				return -4;
		}
		
		var dt = t - this.t;			// Use stored value of previous time to calculate small time interval 'dt'

		this.x += this.v * dt;
		this.v += a(t) * dt;

		this.position(this.x, 0);

		this.t = t;			// Update previous value of time 
	}


	var particle2 = phy.makeCircle(8, 1, 0.15);
	particle2.fill = 'blue';
	particle2.stroke = null;

	particle2.update = function(t) {

		this.position(8 - t, 1);
	}


	// Add time indicator text box
	var txtTime = phy.makeTimeText(8,3);
	


	// Add all objects that need to be animated to the list of objects to update
	phy.addToUpdate(particle, particle2, txtTime);

	// Setup animation
	phy.setupAnimation();

	// Render first frame but do NOT start animation.
	phy.update();
}




/**
 * Define a function that gives the position of the particle as a function of time.
 */
function pos(t) {

	return -15 + t;
}


/** Start the animation when the window finishes loading. */
window.onload = init;
