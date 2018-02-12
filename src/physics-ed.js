/**
 * An array with a modified reverse() method that takes a flag that determines if reversal will happen.
 */
class RArray extends Array {

	/** @arg {boolean} flag - Reverse array, in-place, if true. */
	reverse(flag = true) {

		if (flag) 
			super.reverse();		// Use the reverse method fo the super-class to carry out the actual reverssl.

		return this;		// Like the superclass reverse() returns a handle to the object
	}
}


/**
 * Map functions from the first array to arguments in the second array in a one-to-one fashion to create an array of answers.
 * @arg {Array} functions - Array of functions to be applied.
 * @arg {Array} args - Array of arguments, one for each function in the first array.
 * @returns {Array} - The result of applying functions to corresponding arguments.
 */
 function zipFunctions(functions, args) {

 	var results = [];
 	
 	for (i = 0; i < functions.length; i++)
 		results.push( functions[i]( args[i] ) );		// For each i apply the corresponding function to the corresponding argument adn store it in 'results'

 	return results;
}


/**
 * Normalizes window dimensions to 100 x 100. Aspect ratio is 1:1 with 100 units corresponding to the shorter of the two dimensions (x or y).
 * @constructor stores the passed in width and height of the rendering scene.
 */
class Dimensions {
	constructor(width, height) {

		this.length = Math.min(width, height);			// 
	}

	/**
	 * Convert normalized percent units (100 per length) in to actual pixels on the screen.
	 * 
	 * @arg {float} percent - Length in units of percentage.
	 * @returns {float} - Percentage length converted to actual pixels on the screen.
	 */
	px(percent) {

		return percent * this.length / 100; 
	}

	/**
	 * Convert length in pixels in to normalized percent units.
	 *
	 * @arg {float} pixels - Length in actual pixels.
	 * @returns {float} - Length in normalized percentage units.
	 */
	per(pixels) {

		return pixels / this.length * 100;
	}
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

	var param = { width: window.innerWidth, height: window.innerHeight, type: Two.Types.svg};
	var two = new Two(param).appendTo(elem);

	// Create normalized percent units for the scene.
	dims = new Dimensions(two.width, two.height);
	Two.dims = dims;			// Store the dims 'Two' class (NOT in an instant, in the class itself which is globally accessible).

	// Translate scene so that its (0,0) matches with center of screen
	two.scene.translation.set(two.width / 2, two.height / 2);

	return two;
}


/**
 * Create an arrow-head centered at (0,0) and pointing to the right
 */
function makeArrowHead(pixelWidth = 13) {
	
	var arrowHead = new Two.Group();

	// Add arrow to the right of the axis line
	arrowHead.add(new Two.Line(0,0,-pixelWidth, pixelWidth));
	arrowHead.add(new Two.Line(0,0,-pixelWidth,-pixelWidth));

	arrowHead.pixelWidth = pixelWidth;

	return arrowHead;
}


/**
 * xAxis and yAxis are instances of this subclass of Two.Group
 */
class Axis extends Two.Group {
	
	/**
	 * Store handles to the Two-objects corresponding to the tick and label of the zero point on the axis.
	 *
	 * @arg {Two.Line} tick - Tick of the zero point on the axis.
	 * @arg {Two.Text} label - Label of the zero point on the axis.
	 */
	declareZero(tick, label) {

		this.zeroTick = tick;
		this.zeroLabel = label;
	}

	/** 
	 * Remove the zero-point tick and label form the axis
	 * @{returns} The Axis object (to allow chaining).
	 */
	suppressZero() {
		
		this.remove(this.zeroTick, this.zeroLabel);

		return this;		// Return a handle to the object itselt so that one can chain with this method.
	}
}


/**
 *	Make the x-axis (Two.Group).
 *
 *	The center of the drawn line is at the center of the screen (0,0) regardless of where the 0 value of the axis might be. Use 'translate' to move the created group around.
 *  Assumes that initScene() and new Dimensions() has been called.
 * 
 *	@arg {int} start - Smallest tick label of axis.
 *	@arg {int} finish - Largest tick label of axis.
 *	@arg {int} step - Interval between successive ticks.
 *	@arg {float} ppos - Position of x-axis along the y direction in scale/axis units 
 *	@arg {float} width - Required total width of the axis in percent-units (see Dimensions). Ignored if spacing is unequal to zero.
 *	@arg {float} spacing - Number of pixels per unit on the scale (length between successive integral ticks)
 *	@arg {float} extension - Distance (in scale/axis-units) to extend axis beyond end-most ticks (and specified width)
 *	@returns {Two.Group} - Axis (subclass of Two.Group) corresponding to the axis.
 */
function makeXAxis(start, finish, step = 1, ppos = 0, width = 300, spacing = 0, extension = 0.3) {

	var dims = Two.dims;		// Get the Dimensions object stored 

	if (spacing == 0)
		spacing = width / (finish - start);

	var center = (start + finish) / 2;		// Calculate the tick label of the center of the axis based on specified start and finish.
											// To make sure that the entire axis is centered on the scene we have to shift all positions by this amount

	// Calculate the start and finish positions in absolute pixel values after incorporating the center of the axis, the spacing between ticks, and the extension
	// 'start - center' shifts 'start' such that the created axis is centered on the center of the scene.
	var absStart = (start - center - extension) * spacing;
	var absFinish = (finish - center + extension) * spacing;
	ppos *= spacing;			// Mulitply by ppos to convert from scale-units to percent-units

	var axis = new Axis();			// create empty Axis (essentially a Two.Group)

	axis.add(new Two.Line(dims.px(absStart), dims.px(ppos), dims.px(absFinish), dims.px(ppos)));		// Create main horizontal line
	
	// Add arrow head
	var arrowHead = makeArrowHead();
	arrowHead.translation.set(dims.px(absFinish), dims.px(ppos));
	axis.add(arrowHead);
	axis.arrowHead = {};									// Create empty object for axis.arrowHead so that we can insert .pixelWidth in to it on the next line
	axis.arrowHead.pixelWidth = arrowHead.pixelWidth;		// Store the arrowHead pixelWidth for reuse in second axis for matching

	for (var i = start; i <= finish; i += step) {

		var tick = new Two.Line(dims.px((i - center) * spacing), dims.px(ppos - 2), dims.px((i - center) * spacing), dims.px(ppos + 2));
		var label = new Two.Text(i, dims.px((i - center) * spacing), dims.px(ppos - 5));

		axis.add(tick);
		axis.add(label);

		if (i == 0) {						// If there is a zero-tick we store the tick and label so we can remove it later if required
			axis.declareZero(tick, label);
		}
	}


	axis.spacing = spacing;		// Append the spacing to the object
	axis.linewidth = 1.5;

	return axis;
}


/**
 * Make a y-axis Two.Group.
 *
 * Completely analogous to makeXAxis.
 */
function makeYAxis(start = -8, finish = 8, step = 1, xpos = 0, width = 80, extension = 3) {
	
	var spacing = width / (finish - start);
	var center = (start + finish) / 2;

	var yAxis = new Axis();

	yAxis.add(new Two.Line(dims.px(xpos), dims.px(spacing * (start - center) - extension), dims.px(xpos), dims.px(spacing * (finish - center) + extension)));

	for (var i = start; i <= finish; i += step) {
		var tick = new Two.Line(dims.px(xpos - 2), dims.px((i - center) * spacing), dims.px(xpos + 2), dims.px((i - center) * spacing));
		var label = new Two.Text(i, dims.px(xpos - 5), dims.px((i - center) * spacing));

		yAxis.add(tick);
		yAxis.add(label);

		if (i == 0) {
			yAxis.declareZero(tick, label);
		}
	}

	yAxis.spacing = spacing;

	return yAxis;
}
