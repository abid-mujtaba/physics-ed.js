/**
 * Normalizes window dimensions to 100 x 100.
 * @constructor stores the passed in width and height of the rendering scene
 */
class Dimensions {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	/**
	 * Convert x-position in percentage of screen width to actual pixel value.
	 * @arg {float} xPercent - x-position in terms of percentage of the scene width. Can be negative. 
	 * @returns {float} - x-position in actual pixels calculated using the internally stored width of the scene. 
	 */
	X(xPercent) {

		return xPercent * this.width / 100;
	}

	/** y-position function analogous to X() */
	Y(yPercent) {

		return - yPercent * this.height / 100;		// The minus sign means positive y corresponds to vertically upward (the opposite of images)
	}
}

/**
 * Creates the root scene (Two() object).
 * 
 * Translates the scene so that its center (0,0) matches with the center of the specified element.
 * 
 * @param {float} width - Width of the scene (in pixels).
 * @param {float} height - Height of the scene (in pixels).
 * @param {DOM.Element} elem - The domElement that will contain the scene, usually a <div>. 
 * @returns {Two} - Root scene object.
 */
function initScene(width, height, elem) {

	var param = { width: window.innerWidth, height: window.innerHeight, type: Two.Types.svg};
	var two = new Two(param).appendTo(elem);

	// Translate scene so that its (0,0) matches with center of screen
	two.scene.translation.set(two.width / 2, two.height / 2);

	return two;
}

/**
 *	Make an x-axis Two.Group.
 *
 *	The center of the drawn line is at the center of the screen (0,0) regardless of where the 0 value of the axis might be. Use 'translate' to move the created group around.
 *  Assumes that initScene() and new Dimensions() has been called.
 * 
 *	@param {int} start - Left-most tick label of axis.
 *	@param {int} finish - Right-most tick label of axis.
 *	@param {int} step - Interval between successive ticks.
 *	@param {float} ypos - y-position of the x-axis in y-percent
 *	@param {float} width - Required total width of the axis in x-percent (see Dimensions)
 *	@param {float} extension - Distance (in x-percent) to extend axis beyond end-most ticks (and specified width)
 *	@returns {Two.Group} - Return the Two.Group corresponding to the x-axis.
 */
function makeXAxis(start = -8, finish = 8, step = 1, ypos = 0, width = 80, extension = 3) {
	
	var spacing = width / (finish - start);
	var center = (start + finish) / 2;		// Calculate the tick label of the center of the axis based on specified start and finish.
											// To make sure that the entire axis is centered on the scene we have to shift all positions by this amount

	var xAxis = new Two.Group();		// create empty group

	xAxis.add(new Two.Line(dims.X(spacing * (start - center) - extension), dims.Y(ypos), dims.X(spacing * (finish - center) + extension), dims.Y(ypos)));		// Create main horizontal line
	// 'start - center' shifts 'start' such that the created axis is centered on the center of the scene.

	for (var i = start; i <= finish; i += step) {

		var tick = new Two.Line(dims.X((i - center) * spacing), dims.Y(ypos - 2), dims.X((i - center) * spacing), dims.Y(ypos + 2));
		var label = new Two.Text(i, dims.X((i - center) * spacing), dims.Y(ypos - 5));

		xAxis.add(tick);
		xAxis.add(label);

		if (i == 0) {						// If there is a zero-tick we store the tick and label so we can remove it later if required
			xAxis.zeroTick = tick;
			xAxis.zeroLabel = label;
		}

		xAxis.suppressZero = function () {						// A function that removes the zero tick and label
			xAxis.remove(xAxis.zeroTick, xAxis.zeroLabel);
		}
	}

	xAxis.spacing = spacing;		// Append the spacing to the object
	two.add(xAxis);			// Objects created using the Two.<constructor> have to be added explicitly

	return xAxis;
}


/**
 * Make a y-axis Two.Group.
 *
 * Completely analogous to makeXAxis.
 */
function makeYAxis(start = -8, finish = 8, step = 1, xpos = 0, width = 80, extension = 3) {
	
	var spacing = width / (finish - start);
	var center = (start + finish) / 2;		// Calculate the tick label of the center of the axis based on specified start and finish.
											// To make sure that the entire axis is centered on the scene we have to shift all positions by this amount

	var yAxis = new Two.Group();		// create empty group

	yAxis.add(new Two.Line(dims.X(xpos), dims.Y(spacing * (start - center) - extension), dims.X(xpos), dims.Y(spacing * (finish - center) + extension)));		// Create main horizontal line
	// 'start - center' shifts 'start' such that the created axis is centered on the center of the scene.

	for (var i = start; i <= finish; i += step) {
		yAxis.add(new Two.Line(dims.X(xpos - 2), dims.Y((i - center) * spacing), dims.X(xpos + 2), dims.Y((i - center) * spacing)));
		yAxis.add(new Two.Text(i, dims.X(xpos - 5), dims.Y((i - center) * spacing)));
	}

	yAxis.spacing = spacing;
	two.add(yAxis);			// Objects created using the Two.<constructor> have to be added explicitly

	return yAxis;
}
