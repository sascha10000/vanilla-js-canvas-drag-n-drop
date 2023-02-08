window.onload = (ev) => {
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	const drawables = [
		new Rect({ x: 10, y: 10 }, { width: 1, height: 1 }, 0xff0000),
		new Rect({ x: 30, y: 80 }, { width: 80, height: 40 }, 0xf0f0f),
	];
	console.log(canvas.offsetLeft, canvas.clientLeft);
	const dragMan = new DragManager();

	canvas.onmousedown = (mouseEvent) => {
		const mousePos = getMousePos(mouseEvent);
		drawables.forEach((element) => {
			if (element.isColliding(mousePos) && !dragMan.isDragging()) {
				dragMan.drag(element, mousePos);
			}
		});
	};

	canvas.onmousemove = (mouseEvent) => {
		const mousePos = getMousePos(mouseEvent);
		dragMan.move(mousePos);
	};

	canvas.onmouseup = () => {
		dragMan.drop();
	};

	draw(ctx, drawables);
};

const getMousePos = (mouseEvent) => {
	return { x: mouseEvent.x, y: mouseEvent.y };
};

const draw = (ctx, drawables) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawables.forEach((element) => {
		element.draw(ctx);
	});

	setTimeout(draw, 100, ctx, drawables);
};

const checkCollision = (drawables, mousePos) => {
	drawables.forEach((element) => {
		if (element.isColliding(mousePos)) {
			element.drag;
		}
	});
};

class Drawable {
	pos; // : {x: number, y: number}
	bounds; // depends on the implementation

	isColliding(mousePos) {}
	draw(context) {}
}

class Rect extends Drawable {
	/**
	 * Implements a Rectangle
	 *
	 * @param {{x: number, y: number}} pos
	 * @param {{width: number, height: number}} bounds
	 * @param {number | string} color
	 */
	constructor(pos, bounds, color) {
		super();
		this.pos = pos;
		this.bounds = bounds;
		this.color = color;
	}

	/**
	 * Collision test for a single coordinate
	 *
	 * @param {{x: number, y: number}} mousePos
	 * @returns if object collides with given coordinates
	 */
	isColliding(mousePos) {
		if (
			mousePos.x > this.pos.x &&
			mousePos.x < this.pos.x + this.bounds.width &&
			mousePos.y > this.pos.y &&
			mousePos.y < this.pos.y + this.bounds.height
		)
			return true;

		return false;
	}

	/**
	 * Draws the rectangle
	 *
	 * @param {CanvasContext2d} context
	 */
	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(
			this.pos.x,
			this.pos.y,
			this.bounds.width,
			this.bounds.height
		);
	}

	move(pos) {
		this.pos = pos;
	}
}

class DragManager {
	draggedElement = undefined;
	dragOffset = undefined;
	constructor() {}

	drag(element, mousePos) {
		if (this.draggedElement != undefined) return;

		this.draggedElement = element;
		this.dragOffset = {
            x: this.draggedElement.pos.x - mousePos.x,
            y: this.draggedElement.pos.y - mousePos.y
        }
	}

	drop() {
		this.draggedElement = undefined;
		this.mousePos = undefined;
	}

	move(toMousePos) {
		if (this.draggedElement == undefined) return;

		this.draggedElement.pos = {
            x: toMousePos.x + this.dragOffset.x,
            y: toMousePos.y + this.dragOffset.y
        };
	}

	isDragging() {
		return this.draggedElement != undefined;
	}
}
