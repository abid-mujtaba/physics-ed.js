/**
 * Units is a class that stores the scene dimensions, the user-specified dimensions of the scene and provides mechanisms to convert between them.
 */
class Units {

	/**
	 * @arg {float} width - Width of the scene in units chosen by the user. All objects will be drawn based on this choice.
	 * @arg {float} height - ONLY used if width is undefined. If width is specified height is calculated automatically to preserve aspect ratio 1:1 between horizontal and vertical units. Height of the scene in units chosen by the user.
	 * @arg {int} pixelWidth - Width of the scene in PIXELS.
	 * @arg {int} pixelHeight - Height of the scene in PIXELS
	 * @arg {float} originX - X position of origin (with respect to center of the screen) measured in user-units.
	 * @arg {float} originY - Y position of origin (with respect to center of the screen) measured in user-units.
	 */
	constructor(width, height, pixelWidth, pixelHeight, originX, originY) {
		
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

		this.deltaX = originX;
		this.deltaY = originY;
	}


	/**
	 * Convert user units in to actual pixels on the screen.
	 * 
	 * @arg {float} units - Length in user units.
	 * @returns {float} - Length in user units converted to actual pixels on the screen.
	 */
	px(units) {

		return (units + this.deltaX) * this.pixelsPerUnit;
	}


	/**
	 * Convert user units to actual pixels on screen for distance along the y-direction with the UPWARD direction considered positive.
	 * In images the origin is at the top-left corner and downward is considered positive.
	 */
	py(units) {

		return - (units + this.deltaY) * this.pixelsPerUnit;
	}


	/**
	 * Convert user units to actual pixels WITHOUT considering any shift in the origin.
	 */
	abs(units) {

		return units * this.pixelsPerUnit;
	}


	/**
	 * Convert length in pixels in to user units WITHOUT considering any shift in the origin.
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

		
		// Declare defaults for param fields
	    param['sceneWidth'] = param['sceneWidth'] || 640;
	    param['sceneHeight'] = param['sceneHeight'] || 480;

		param['width'] = param['sceneWidth'];
		param['height'] = param['sceneHeight'];

		var originX = param['originX'] || 0;
		var originY = param['originY'] || 0;


		// Declare default for renderer type
		param['type'] = param['type'] || Two.Types.svg;

		// Call the constructor of the superclass Two
		super(param);

		// Construct the new units based on passed in values
	    this.units = new Units(width, height, param['sceneWidth'], param['sceneHeight'], originX, originY);


		// Add modified inner classes
		Phy.Axis = Axis;
		Phy.Units = Units;

		// Patch inner classes
		Phy.patchLine();
		Phy.patchGroup(this.units);


		// Translate scene so that its (0,0) matches with center of screen
		this.scene.translation.set( param['sceneWidth'] / 2, param['sceneHeight'] / 2);

		// Create empty list of objects to be updated
		this.objectsToUpdate = [];


		this.time = 0;								// Internal count of time
		this.fps = param['fps'] || 60;			// FPS of animation, used to convert frameCount to time.
		this.timeScale = 1;						// Factor by which time evolution is scaled. Used to slow down or speed up an animation.
	}


	/**
	 * Static method called to patch a Two object to give it additional properties and methods.
	 */
	patch(object) {

		object.units = this.units;		// Provide internal access to the user-defined units being used

		/**
		 * Create a .position() method that uses user-units for specifying the position of the object.
		 *
		 * @arg {float} x - x-position of object in user-units.
		 * @arg {float} y - y-position of object in user-units.
		 */
		object.position = function (x,y) {
			
			this.translation.set(this.units.px(x), this.units.py(y));		// Note: In the inner function 'this' refers to the object
		}
	}


	/**
	 * Static method called to patch Phy.Line to give it additional methods.
	 */
	static patchLine() {
		/**
		 * Change the head of the line to the specified coordinates.
		 */
		function head(x, y) {
			// 'this' refers to the Line object
			var h = this.vertices[1];	// The head is defined using the latter coordinates in makeLine so it is the 2nd vertex
			var U = this.units;

			// The Two.Line class readjusts the Line so that it has a build in translation which we have to account for when messing with the Line object's vertices directly i.e. the vertix position is given with respect to the objects global translation.

			h.x = U.px(x) - this.translation.x;
			h.y = U.py(y) - this.translation.y;
		}

		function tail(x,y) {
			var t = this.verticles[0];
			var U = this.units;

			t.x = U.px(x) - this.translation.x;
			t.y = U.py(y) - this.translation.y;
		}

		Phy.Line.prototype.head = head;
		Phy.Line.prototype.tail = tail;
	}


	/**
	 * Patch Phy.Group to add units and give it x and y shift methods using custom units.
	 */
	static patchGroup(units) {

		Phy.Group.prototype.units = units;
		
		function xshift(delta) {

			this.translation._x += units.abs(delta);
		}

		function yshift(delta) {
			
			this.translation._y -= units.abs(delta);		// Note the minus sign since we are using Units.abs() but are moving in the y-direction
		}


		function shift(xdelta, ydelta) {

			this.xshift(xdelta);
			this.yshift(ydelta);
		}

		Phy.Group.prototype.xshift = xshift;
		Phy.Group.prototype.yshift = yshift;
	}


	/**
	 * Add an object to the list of 
	 */
	addToUpdate(objects) {

		for (var i = 0; i < arguments.length; ++i) {

			var object = arguments[i];

			if (this.objectsToUpdate.includes(object))		// Any object will only be added once
				return;

			this.patch(object);						// Any object that is going to be updated will be patched first.
			this.objectsToUpdate.push(object);
		}
	}


	/**
	 * Bind object .update functions for animation and set up keyboard controls.
	 * MUST be called after objects have already been added to the list of objects to be updated
	 * TODO: Add keyboard shortcuts for pause, play, speed up, slow down and possibly reverse.
	 */
	setupAnimation() {

		// Carry out setup of object animation before calling the superclass method
		this.bind('update', function (frameCount) {			// Execute this anonymous function when the 'update' event is triggered

			// Update value of time by incrementing it using the time-scale and 1 / fps which equals the time-interval between frames.
			this.time += this.timeScale / this.fps;
			//var t = frameCount / this.fps * this.timeScale;		// Calculate current value of time based on frames past, fps and timescale.

			for (var i = 0; i < this.objectsToUpdate.length; ++i)		// Iterate over all objects in the list
				
				this.objectsToUpdate[i].update(this.time);			// Run the .update() method of the object using the computed time
		});


		var phy = this;		// Create handle for access in inner function.

		// Attach a keypress event-listener function to the root document. This will allow us to control the animation.
		document.onkeypress = function (k) {

			if (k.ctrlKey || k.altKey || k.shiftKey) {		// We are interested in unmodified keypress so if there is any modifier present we return true
				return true;							    // A 'true' returned means the event was NOT digested and will be passed on for other listeners to process
			}
			
			switch (k.key) {

				case " ":		// Toggle Pause and Play
					phy.playing = ! phy.playing;		// Toggle phy.playing which plays or pauses the animation
					break;

				case "f":		// Increase speed 
					phy.timeScale *= 2;
					break;

				case "s":		// Decrease speed
					phy.timeScale *= 0.5;
					break;

				case "r":		// Reverse direction of time
					phy.timeScale *= -1;
					break;

				default:
					return true;
			}

			return false;		// This indicates that the key-press has been digested (unavailable for other listeners down the stack)
		}
	}


	/**
	 * Define wrapped functions for making objects that convert from user-units to pixels using this.units before calling the superclass methods to carry out the acutal construction.
	 */
	makeRectangle(x, y, width, height) {

		var U = this.units;			// The Units object that converts from user-units to pixels
		return super.makeRectangle(U.px(x), U.py(y), U.abs(width), U.abs(height));		// Convert from user-units to pixel before calling the corresponding superclass method
	}


	makeCircle(ox, oy, r) {
		
		var U = this.units;
		return super.makeCircle(U.px(ox), U.py(oy), U.abs(r));
	}


	/**
	 * This function assumes that the first pair represents the 'tail' and the latter pair the 'head' of the line.
	 */
	makeLine(x1, y1, x2, y2) {

		var U = this.units;
		var line = super.makeLine(U.px(x1), U.py(y1), U.px(x2), U.py(y2));
		this.patch(line);			// Gives access to the Units object for later use when updating the head.

		return line
	}


	/** Create a Horizontal Line **centered** on (x0, y0) with specified 'width' */
	makeHLine(x0, y0, width) {
	
		width /= 2;
		return this.makeLine(x0 - width, y0, x0 + width, y0);	
	}


	/** Create a Vertical Line **centered** on (x0, y0) with specified 'height' */
	makeVLine(x0, y0, height) {
	
		height /= 2;
		return this.makeLine(x0, y0 - height, x0, y0 + height);	
	}


	/** Add text at the specified location */
	makeText(text, x, y, styles) {
		
		var U = this.units;
		return super.makeText(text, U.px(x), U.py(y), styles);
	}


	/** 
	 * Add time indicator at the specified location
	 *
	 * @arg {float} x - x-position of time indicator in user-units
	 * @arg {float} y - y-position of time indicator in user-units
	 * @arg {} styles - Object accepted by the Two.makeText method
	 */
	makeTimeText(x, y, styles) {

		var U = this.units;
		var txt = super.makeText("", U.px(x), U.py(y), styles);

		txt.update = function(t) {

			txt.value = "t = " + Number(t).toFixed(1) + " sec";		// Update text in box to indicate time
		}

		return txt;
	}


	/**
	* Create an arrow-head centered at (0,0) and pointing to the right
	* @arg {float} width - Both width and height of diagonal lines or arrow head measured in scale-units.
	*/
	makeArrowHead(width = 0.15) {
		
		var U = this.units;
		var arrowHead = new Phy.Group();			// Create new group which has knowledge of units

		// Create arrow head with tip at (0,0) of the SCENE and pointing to the right (trailing back to the left)
		// This makes the "center" of the arrowHead at the tip and not the center of the scene.
		arrowHead.add(new Two.Line(0,0, - U.abs(width), U.abs(width)));
		arrowHead.add(new Two.Line(0,0, - U.abs(width), - U.abs(width)));

		// Move the created arrowHead to the user-defined origin.
		arrowHead.translation.set(U.px(0),0);

		return arrowHead;
	}


	/**
	 * Create an arrow at the specified tail-point with the specified x and y components.
	 *
	 * @arg {Two.Vector} tail - 2D vector position of tail of arrow.
	 * @arg {Two.Vector} comp - 2D vector containing the components of the vector.
	 */
	makeArrow(tailX, tailY, compX, compY) {

		var U = this.units;
		var tail = new Two.Vector(tailX, tailY);
		var comp = new Two.Vector(compX, compY);

		return new Arrow(this, tail, comp);
	}


	/**
	*	Make the x-axis (Axis <- Phy.Group) and add it to the Phy object.
	*
	*	The axis is drawn 1:1 with the underlying units with its origin coinciding with the center of the screen. The scale factor is applied afterwards (without mvoving the origin, which should be done using xshift and yshift.
	* 
	*	@arg {int} start - Smallest tick label of axis.
	*	@arg {int} finish - Largest tick label of axis.
	*	@arg {int} step - Interval between successive ticks.
	*	@arg {float} scale - Multiplicative factor by which to scale the axis.
	*	@arg {float} extension - Distance (in user-units) to extend axis beyond end-most ticks.
	*	@returns {Phy.Axis} - Subclass of Phy.Group corresponding to the axis.
	*/
	makeXAxis(start, finish, step = 1, scale = 1, extension = 0.5) {i

		// 'start - center' shifts 'start' such that the created axis is centered on the center of the scene.
		var absStart = scale * start - extension;
		var absFinish = scale * finish + extension;

		var axis = new Phy.Axis(this.units);			// create empty Axis (essentially a Two.Group)

		axis.add(this.makeLine(absStart, 0, absFinish, 0));			// Create main horizontal line
		
		// Add arrow head
		var arrowHead = this.makeArrowHead();
		arrowHead.xshift(absFinish);
		axis.add(arrowHead);

		for (var i = start; i <= finish; i += step) {

			var tick = this.makeVLine(i * scale, 0, 0.3);
			var label = this.makeText(i, i * scale, -0.4);

			axis.add(tick);
			axis.add(label);

			if (i == 0) {						// If there is a zero-tick we store the tick and label so we can remove it later if required
				axis.declareZero(tick, label);
			}
		}

		axis.linewidth = 1.5;

		this.scene.add(axis);		// Automatically add the axis to the scene

		return axis;			// 'make' functions are understood to automatically add the created object to the scene.
	}


	/**
	*	Make the y-axis (Axis <- Phy.Group) and add it to the Phy object.
	*
	*	The axis is drawn 1:1 with the underlying units with its origin coinciding with the center of the screen. The scale factor is applied afterwards (without mvoving the origin, which should be done using xshift and yshift.
	* 
	*	@arg {int} start - Smallest tick label of axis.
	*	@arg {int} finish - Largest tick label of axis.
	*	@arg {int} step - Interval between successive ticks.
	*	@arg {float} scale - Multiplicative factor by which to scale the axis.
	*	@arg {float} extension - Distance (in user-units) to extend axis beyond end-most ticks.
	*	@returns {Phy.Axis} - Subclass of Phy.Group corresponding to the axis.
	*/
	makeYAxis(start, finish, step = 1, scale = 1, extension = 0.5) {

		var absStart = start * scale - extension;
		var absFinish = finish * scale + extension;

		var axis = new Phy.Axis(this.units);			// create empty Axis (essentially a Two.Group)

		axis.add(this.makeLine(0, absStart, 0, absFinish));			// Create main vertical line
		
		// Add arrow head
		var arrowHead = this.makeArrowHead();
		arrowHead.yshift(absFinish);
		arrowHead.rotation = - Math.PI / 2;
		axis.add(arrowHead);

		for (var i = start; i <= finish; i += step) {

			var tick = this.makeHLine(0, i * scale, 0.3);
			var label = this.makeText(i, -0.4, i  * scale);

			axis.add(tick);
			axis.add(label);

			if (i == 0) {						// If there is a zero-tick we store the tick and label so we can remove it later if required
				axis.declareZero(tick, label);
			}
		}

		axis.linewidth = 1.5;

		this.scene.add(axis);		// Automatically add the axis to the scene

		return axis;			// 'make' functions are understood to automatically add the created object to the scene.
	}
}


/**
 * xAxis and yAxis are instances of this subclass of Phy.Group
 */
class Axis extends Phy.Group {
	
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
 * Arrow that is positioned with respect to its tail and is specified using x and y components.
 */
class Arrow extends Phy.Group {

	/**
	 * Create an arrow (line and arrow-head).
	 * @arg {Two.Vector} tail - Position of tail of vector.
	 * @arg {Two.Vector} comp - Components of the vector (to be appended to the tail).
	 */
	constructor(phy, tail, comp) {

		super();

		this.tail = tail;
		this.comp = comp;

		var angle = Math.atan2(comp.y, comp.x);
		var head = new Two.Vector();
		head.add(tail, comp);

		this.head = head;

		this.line = phy.makeLine(tail.x, tail.y, head.x, head.y);
		this.arrowHead = phy.makeArrowHead();
		phy.patch(this.arrowHead);						// Patch to get access to .position() method

		this.arrowHead.rotation = angle;
		this.arrowHead.position(head.x, head.y);	

		this.add(this.line);
		this.add(this.arrowHead);

		phy.scene.add(this);
	}


	/**
	 * Change the position of the head of the vector without affecting its tail.
	 */
	updateHead(x, y) {

		this.head = new Two.Vector(x, y);
	    this.comp.sub(this.head, this.tail);	
	    var angle = Math.atan2(this.comp.y, this.comp.x);

	    this.line.head(x, y);				// Patched method for Line object
	    this.arrowHead.rotation = angle;
	    this.arrowHead.position(x, y);
	}
}
