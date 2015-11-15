
class CanvasUIManager
{
	children: Array<CanvasUISheet> = new Array();
	context: CanvasRenderingContext2D;
	constructor(ctx: CanvasRenderingContext2D)
	{
		this.context = ctx;
	}
	tick()
	{
		for(var i = 0; i < this.children.length; i++){
			this.children[i].draw(this.context);
		}
	}
	addChild(s: CanvasUISheet)
	{
		this.children.push(s);
	}
	removeChild(s: CanvasUISheet)
	{
		return this.children.removeAnObject(s);
	}
	mouseDown(p: Vector2D){
		for(var i = 0; i < this.children.length; i++){
			if(this.children[i].includesPoint(p)){
				this.children[i].mouseDown(p.getCompositeVector(this.children[i].origin.getInverseVector()));
			}
		}
	}
}

class CanvasUISheet extends Rectangle2D
{
	children: Array<CanvasUISheet> = new Array();
	backgroundColor: string = "rgba(255, 255, 255, 0.75)";
	borderColor: string = "rgba(51, 119, 193, 0.5)";
	draw(ctx: CanvasRenderingContext2D)
	{
		var x: number = this.origin.x;
		var y: number = this.origin.y;
		var w: number = this.size.x;
		var h: number = this.size.y;
		//
		ctx.fillStyle = this.backgroundColor;
		ctx.strokeStyle = this.borderColor;
		ctx.fillRect(x, y, w, h);
		ctx.strokeRect(x, y, w, h);
		//
		/*
		ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
		ctx.font = "normal 32px 'Source Code Pro', source-code-pro";
		ctx.MGC_drawText("Node", x + this.size, y + this.size);
		*/
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
		for(var i = 0; i < this.children.length; i++){
			this.children[i].draw(ctx);
		}
		ctx.restore();
	}
	addChild(s: CanvasUISheet)
	{
		this.children.push(s);
	}
	removeChild(s: CanvasUISheet)
	{
		return this.children.removeAnObject(s);
	}
	mouseDown(p: Vector2D){
		for(var i = 0; i < this.children.length; i++){
			if(this.children[i].includesPoint(p)){
				this.children[i].mouseDown(p.getCompositeVector(this.children[i].origin.getInverseVector()));
			}
		}
	}
}

class CanvasUIButton extends CanvasUISheet
{
	label: string = "Button";
	fontColor: string = "rgba(0, 0, 0, 0.75)";
	fontSize: number = 16;
	font: string = "'Source Code Pro', source-code-pro";
	callback: Function;
	//
	constructor(s: string, x: number, y: number, w: number, h: number, callback: Function)
	{
		super(x, y, w, h);
		this.label = s;
		this.callback = callback;
	}
	//
	draw(ctx: CanvasRenderingContext2D)
	{
		var x: number = this.origin.x;
		var y: number = this.origin.y;
		var w: number = this.size.x ? this.size.x : this.size.x = ctx.measureText(this.label).width + 16;
		var h: number = this.size.y ? this.size.y : this.size.y = this.fontSize + 4;
		//
		ctx.fillStyle = this.backgroundColor;
		ctx.strokeStyle = this.borderColor;
		ctx.fillRect(x, y, w, h);
		ctx.strokeRect(x, y, w, h);
		//
		ctx.fillStyle = this.fontColor;
		ctx.font = this.fontSize + "px " + this.font;
		ctx.textBaseline = "top";
		ctx.fillText(this.label, x + 6, y);
	}
	mouseDown(p: Vector2D){
		if(this.callback instanceof Function){
			this.callback(p);
		}
	}
}
