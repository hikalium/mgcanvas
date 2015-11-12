
class CanvasUIManager
{
	sheetRoot: Array<CanvasUISheet> = new Array();
	context: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	constructor(canvasDOMObj: any)
	{
		this.canvas = canvasDOMObj;
		this.context = this.canvas.getContext('2d');
	}
}

class CanvasUISheet extends Rectangle2D 
{
	children: Array<CanvasUISheet> = new Array();
}
