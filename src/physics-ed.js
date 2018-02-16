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
 * Units is a class that stores the scene dimensions, the user-specified dimensions of the scene and provides mechanisms to convert between them.
 */
class Units {

	/**
	 * @arg {float} width - Width of the scene in units chosen by the user. All objects will be drawn based on this choice.
	 * @arg {float} height - ONLY used if width is undefined. If width is specified height is calculated automatically to preserve aspect ratio 1:1 between horizontal and vertical units. Height of the scene in units chosen by the user.
	 * @arg {int} pixelWidth - Width of the scene in PIXELS.
	 * @arg {int} pixelHeight - Height of the scene in PIXELS
	 */
	constructor(width, height, pixelWidth, pixelHeight) {
		
		this.pixelWidth = pixelWidth;
		this.pixelHeight = pixelHeight;

		if (width) {
			this.width = width;
			this.pixelsPerUnit = pixelWidth / width;
			this.height = pixelHeight / this.pixelsPerUnit;
		}
		else {
			this.height = height;
			this.pixelsPerUnit = pixelHeight / height;
			this.width = pixelWidth / this.pixelsPerUnit;
		}
	}


	/**
	 * Convert user units in to actual pixels on the screen.
	 * 
	 * @arg {float} units - Length in user units.
	 * @returns {float} - Length in user units converted to actual pixels on the screen.
	 */
	px(units) {

		return units * this.pixelsPerUnit;
	}


	/**
	 * Convert user units to actual pixels on screen for distance along the y-direction with the UPWARD direction considered positive.
	 * In images the origin is at the top-left corner and downward is considered positive.
	 */
	py(units) {

		return - this.px(units);
	}

	/**
	 * Convert length in pixels in to user units.
	 *
	 * @arg {float} pixels - Length in actual pixels.
	 * @returns {float} - Length converted to user units.
	 */
	u(pixels) {

		return pixels / this.pixelsPerUnit;
	}
}


/**
 * The Phy class which extends the Two class focusing on an internal set of units for every object and adding new objects that are used frequently in Physics.
 *
 * @constructor Accepts a dictionary object:
 *
 * 		Accepts all of the same arguments as Two with the exception of:
 *
 *		@arg {int} sceneWidth - Is called 'width' in Two. The width of the scene in PIXELS. Default: 640.
 *		@arg {int} sceneHeight - Is called 'height' in Two. The height of the scene in PIXELS. Default: 480.
 *		@arg {float} width - The width of the scene in units defined by the user. These are the units that will be used to create ALL objects. PIXELS will NOT be used. If both the width AND the height are NOT specified the default width will be set to 20. (-10 to +10).
 *		@arg {float} height - Only used if width is NOT specified. The height of the scene in units defined by the user. (See width.)
 */
class Phy extends Two {
	
	constructor(param) {

		// Store (or default to) the width and height in user-defined units.
	    var width, height;	

	    if (param['width'])				// Width takes precedence
	    	width = param['width'];
	    else if (param['height'])		// Height is a fall-back if defined.
	    	height = param['height'];
	    else
	    	width = 20;					// If neither is defined use the default value of 20.

		
		// Declare defaults for scene width and height
	    param['sceneWidth'] = param['sceneWidth'] || 640;
	    param['sceneHeight'] = param['sceneHeight'] || 480;

		param['width'] = param['sceneWidth'];
		param['height'] = param['sceneHeight'];


		// Declare default for renderer type
		param['type'] = param['type'] || Two.Types.svg;

		// Call the constructor of the superclass Two
		super(param);


		// Construct the new units based on passed in values
	    this.units = new Units(width, height, param['sceneWidth'], param['sceneHeight']);

		// Translate scene so that its (0,0) matches with center of screen
		this.scene.translation.set( param['sceneWidth'] / 2, param['sceneHeight'] / 2);


		// Add modified inner classes
		Phy.Group = Group;
	}


	emptyGroup() {
		
		var U = this.units;
		return new Phy.Group(U);
	}


	makeRectangle(x, y, width, height) {

		var U = this.units;			// The Units object that converts from user-units to pixels
		return super.makeRectangle(U.px(x), U.py(y), U.px(width), U.px(height));		// Convert from user-units to pixel before calling the corresponding superclass method
	}


	makeLine(x1, y1, x2, y2) {

		var U = this.units;
		return super.makeLine(U.px(x1), U.py(y1), U.px(x2), U.py(y2));
	}


	/** Create a Horizontal Line **centered** on (x0, y0) with specified 'width' */
	makeHLine(x0, y0, width) {
	
		width /= 2;
		return makeLine(x0 - width, y0, x0 + width, y0);	
	}


	/** Create a Vertical Line **centered** on (x0, y0) with specified 'height' */
	makeVLine(x0, y0, height) {
	
		height /= 2;
		return makeLine(x0, y0 - height, x0, y0 + height);	
	}


	/**
	* Create an arrow-head centered at (0,0) and pointing to the right
	* @arg {float} width - Both width and height of diagonal lines or arrow head measured in scale-units.
	*/
	makeArrowHead(width = 0.15) {
		
		var U = this.units;
		var arrowHead = this.emptyGroup();			// Create new group which has knowledge of units

		// Create arrow head with tip at (0,0) and pointing to the right (trailing back to the left)
		arrowHead.add(this.makeLine(0,0, -width, width));
		arrowHead.add(this.makeLine(0,0, -width, -width));

		return arrowHead;
	}


	/**
	*	Make the x-axis (Two.Group) and add it to the PHy object.
	*
	*	The center of the drawn line is at the center of the screen (0,0) regardless of where the 0 value of the axis might be. Use 'translate' to move the created group around.
	*  Assumes that initScene() and new Dimensions() has been called.
	* 
	*	@arg {int} start - Smallest tick label of axis.
	*	@arg {int} finish - Largest tick label of axis.
	*	@arg {int} step - Interval between successive ticks.
	*	@arg {float} extension - Distance (in user-units) to extend axis beyond end-most ticks.
	*	@returns {Two.Group} - Axis (subclass of Two.Group) corresponding to the axis.
	*/
	makeXAxis(start, finish, step = 1, extension = 0.5) {

		var center = (start + finish) / 2;		// Calculate the tick label of the center of the axis based on specified start and finish.
												// To make sure that the entire axis is centered on the scene we have to shift all positions by this amount

		// 'start - center' shifts 'start' such that the created axis is centered on the center of the scene.
		var absStart = start - center - extension;
		var absFinish = finish - center + extension;

		var axis = new Axis();			// create empty Axis (essentially a Two.Group)

		axis.add(this.makeLine(absStart, 0, absFinish, 0));			// Create main horizontal line
		
		// Add arrow head
		var arrowHead = this.makeArrowHead();
		arrowHead.xshift(absFinish);
		axis.add(arrowHead);

		//axis.tickLabels = [];

		//for (var i = start; i <= finish; i += step) {

			//var tick = new Two.Line(dims.px((i - center) * spacing), au.py(-0.15), dims.px((i - center) * spacing), au.py(0.15));
			//var label = new Two.Text(i, dims.px((i - center) * spacing), au.py(-0.5));

			//axis.add(tick);
			//axis.add(label);
			//axis.tickLabels.push(label);		// Create a list of the tick labels to remove later if need be.

			//if (i == 0) {						// If there is a zero-tick we store the tick and label so we can remove it later if required
				//axis.declareZero(tick, label);
			//}
		//}

		axis.linewidth = 1.5;

		this.scene.add(axis);		// Automatically add the axis to the scene

		return axis;			// 'make' functions are understood to automatically add the created object to the scene.
	}
}


class Group extends Two.Group {

	constructor(units) {
		super();

		this.units = units;
	}
	
	xshift(delta) {

		this.translation._x += this.units.px(delta);
	}
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
