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
 * @constructor stores the minimum of the passed in width and height of the rendering scene as the length that corresponds to 100 percent-units.
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
	 * Convert percent units to actual pixels on screen for distance along the y-direction with the UPWARD direction considered positive.
	 * In images the origin is at the top-left corner and downward is considered positive.
	 */
	py(percent) {

		return - this.px(percent);
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


// TODO Ensure that every unit mentioned OUTSIDE of this script using axis units exclusively.
// TODO Provde a flag in the constructor that allows one to use the maximum dimension instead of the minimum dimension for scaling axis units to 100.
// TODO Use Phy as a wrapper on top of Two and wrap all methods of Two so that the wrapped Phy versions use axis units exclusively allowing for a cleaner and more consolided approach.
/** Convert between axis-units (units that correspond to the drawn axis) and actual pixels. Analogous to Dimensions. */
class AxisUnits {
	constructor(pixelsPerAxisUnit) {

		this.pixelsPerAxisUnit =  pixelsPerAxisUnit;
	}

	/**
	 * Convert axis units in to actual pixels on the screen.
	 * 
	 * @arg {float} axisUnits - Length in axis units.
	 * @returns {float} - Length in axis units converted to actual pixels on the screen.
	 */
	px(axisUnits) {

		return axisUnits * this.pixelsPerAxisUnit;
	}


	/**
	 * Convert axis units to actual pixels on screen for distance along the y-direction with the UPWARD direction considered positive.
	 * In images the origin is at the top-left corner and downward is considered positive.
	 */
	py(axisUnits) {

		return - this.px(axisUnits);
	}

	/**
	 * Convert length in pixels in to axis units.
	 *
	 * @arg {float} pixels - Length in actual pixels.
	 * @returns {float} - Length converted to axis units.
	 */
	au(pixels) {

		return pixels / this.pixelsPerAxisUnit;
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
 * @arg {float} width - Both width and height of diagonal lines or arrow head measured in scale-units.
 */
function makeArrowHead(width = 0.15) {
	
	var au = Two.axisUnits;					// Access the axis units
	var arrowHead = new Two.Group();

	// Add arrow to the right of the axis line
	arrowHead.add(new Two.Line(0,0,-au.px(width), au.px(width)));
	arrowHead.add(new Two.Line(0,0,-au.px(width),-au.px(width)));

	return arrowHead;
}


// TODO Place Axis inside the Phy container.
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

	
	// TODO extend core class of Two to incorporate xshift and yshift in all objects (which will incorporate it in to Two.Group automatically)
	// TODO Add a shift(,) method that recursively calls xshift and yshift
	/**
	 * Shift the axis in the x-direction by amount 'delta'.
	 * @arg {float} delta - Amount to shift axis in x-direction measured in scale-units.
	 */
	xshift(delta) {

		this.translation._x += Two.axisUnits.px(delta);
	}


	/**
	 * Shift the axis in the y-direction by amount 'delta'.
	 * @arg {float} delta - Amount to shift axis in y-direction measured in scale-units.
	 */
	yshift(delta) {
		
		this.translation._y += Two.axisUnits.px(delta);
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
 *	@arg {float} width - Required total width of the axis in percent-units (see Dimensions). Ignored if spacing is unequal to zero.
 *	@arg {float} spacing - Length between successive integral ticks measured in percent-units.
 *	@arg {float} extension - Distance (in axis-units) to extend axis beyond end-most ticks (and specified width)
 *	@returns {Two.Group} - Axis (subclass of Two.Group) corresponding to the axis.
 */
function makeXAxis(start, finish, step = 1, width = 100, spacing = 0, extension = 0.5) {

	var dims = Two.dims;		// Get the Dimensions object stored 

	if (spacing == 0)
		spacing = width / (finish - start);

	// Create axis units corresponding to this spacing
	var au = new AxisUnits(dims.px(spacing));		// Create and store AxisUnits that will allow us to convert between axis units and actual pixels
	Two.axisUnits = au;

	var center = (start + finish) / 2;		// Calculate the tick label of the center of the axis based on specified start and finish.
											// To make sure that the entire axis is centered on the scene we have to shift all positions by this amount

	// Calculate the start and finish positions in absolute pixel values after incorporating the center of the axis, the spacing between ticks, and the extension
	// 'start - center' shifts 'start' such that the created axis is centered on the center of the scene.
	var absStart = dims.px( (start - center) * spacing ) - au.px(extension);
	var absFinish = dims.px( (finish - center) * spacing ) + au.px(extension);

	var axis = new Axis();			// create empty Axis (essentially a Two.Group)

	axis.add(new Two.Line(absStart, 0, absFinish, 0));		// Create main horizontal line
	
	// Add arrow head
	var arrowHead = makeArrowHead();
	arrowHead.translation.set(absFinish, 0);
	axis.add(arrowHead);

	axis.tickLabels = [];

	for (var i = start; i <= finish; i += step) {

		var tick = new Two.Line(dims.px((i - center) * spacing), au.py(-0.15), dims.px((i - center) * spacing), au.py(0.15));
		var label = new Two.Text(i, dims.px((i - center) * spacing), au.py(-0.5));

		axis.add(tick);
		axis.add(label);
		axis.tickLabels.push(label);		// Create a list of the tick labels to remove later if need be.

		if (i == 0) {						// If there is a zero-tick we store the tick and label so we can remove it later if required
			axis.declareZero(tick, label);
		}
	}


	axis.spacing = spacing;									// Store the spacing (measuring in percent-units
	axis.linewidth = 1.5;

	return axis;
}


/**
 * Make a y-axis Two.Group.
 *
 * Calls makeXAxis and then rotates the created axis to the y-direction.
 */
function makeYAxis(start, finish, step = 1, width = 100, spacing = 0, extension = 0.5) {

	var axis = makeXAxis(start, finish, step, width, spacing, extension);
	axis.rotation = - Math.PI / 2;

	// The tick labels are on the RHS of the y-axis and rotated incorrectly
	for (label of axis.tickLabels) {			// Iterate over all labels stored in axis.tickLabels (an array)

		label.rotation = Math.PI / 2;			// counter-rotate the labels
		label.translation._y -= Two.axisUnits.px(1);		// Shift the labels to the other side of the axis. Note that we are changing the y-value even though the shift is in the x-direction of the outside observer. This is because the yAxis has been rotated by 90 degrees. The rotation is carried out as the last stage of the rendering so our changes have to keep that in mind.
	}

	return axis;
}
