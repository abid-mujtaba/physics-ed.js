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

	// Create a horizontal arrow corresponding to the initial position of the particle.
	var xArrow = phy.makeArrow(0,2,particle.x,0);
	var vArrow = phy.makeArrow(particle.x, 0, particle.v, 0);

	// Create a horizontal arrow corresponding to the initial velocity of the particle

	// Attach a function of time (associated with the first particle) to be called on each iteration
	particle.update = function (t) {

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
		this.t = t;			// Update previous value of time 

		this.x += this.v * dt;
		this.v += a(t) * dt;

		if (this.v < 0)		// Stopping condition so we don not update the position of the particle
			return;

		this.position(this.x, 0);
		xArrow.updateHead(this.x, 2);	// Update the position of the head of the arrow
		vArrow.updateTail(this.x, 0);	// Update tail of the velocity arrow
		vArrow.updateComp(this.v, 0);	// Update components of velocity arrow
	}



	// Add time indicator text box
	var txtTime = phy.makeTimeText(8,3);
	


	// Add all objects that need to be animated to the list of objects to update
	phy.addToUpdate(particle, txtTime);

	// Setup animation
	phy.setupAnimation();

	// Render first frame but do NOT start animation.
	phy.update();
}


/** Start the animation when the window finishes loading. */
window.onload = init;
