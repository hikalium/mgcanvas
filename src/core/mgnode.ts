// Nodeが保存すべき情報
// this.nodeid
// this.contents
// this.position
// this.velocity

class MGNode extends MGDatabaseAtomElement implements MGGraphElement
{
	sizebase: number		= 10;
	lineWidth: number		= 2;
	strokeStyle: string		= "rgba(0, 0, 0, 0.75)";
	fillStyle: string;
	font: string			= "16px sans-serif";
	//
	FillColor_connected: string		= "rgba(255, 255, 255, 0.5)";
	FillColor_noConnection: string	= "rgba(0, 0, 0, 0.5)";
	FillColor_selected: string		= "rgba(255, 0, 0, 1)";
	//
	position: Vector2D;		// [px]
	velocity: Vector2D;		// [px / tick]
	currentForce: Vector2D;	// [px / tick^2]
	//
	size: number = 10;		// radius
	mass: number;
	frictionFactor: number			= 0.005;
	isAnchor: boolean				= false;
	isSelected: boolean				= false;
	edgeCache: Array<any>			= new Array();
	needsUpdateEdgeCache: boolean	= false;
	//
	contextMenu: CanvasUISheet;
	//contextMenuRect: Rectangle2D		= new Rectangle2D(0, 0, 200, 100);
	//contextMenuOpened: boolean		= false;
	//
	env: MGCanvas;
	//
	constructor(contents?: string)
	{
		super(contents);
		// Kinetic attributes
		this.position = new Vector2D(Math.random() * 64 - 32, Math.random() * 64 - 32);
		this.velocity = new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1);
		this.currentForce = new Vector2D(0, 0);
		//  Cached data (will be changed frequently)
		this.mass = this.size * this.size * Math.PI;
		this.fillStyle = this.FillColor_noConnection;
	}
	//
	draw()
	{
		var ctx: CanvasRenderingContext2D = this.env.context;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;
		ctx.font = this.font;
		if(this.isSelected){
			ctx.strokeStyle = this.FillColor_selected;
		} else{
			ctx.strokeStyle = this.strokeStyle;
		}
		//
		ctx.MGC_drawCircle(this.position.x, this.position.y, this.size);
		if(this.contents){
			ctx.fillStyle = this.FillColor_connected;
			ctx.MGC_drawText(this.contents.toString(), this.position.x + this.size, this.position.y + this.size);
		}
		
		// for Debug
		var pTo: Vector2D;
		ctx.strokeStyle = "rgba(255, 183, 19, 0.5)";
		pTo = this.position.getCompositeVector(this.velocity.getVectorScalarMultiplied(100));
		ctx.MGC_drawArrowLine(this.position, pTo);
		
		// context menu
		this.updateContextMenu();
	}
	tick()
	{
		var u: Vector2D;
		var l: number;
		if(this.env.grabbedNode === this){
			this.velocity.x = 0;
			this.velocity.y = 0;
			this.currentForce.setComponent(0, 0);
			return;
		}
		// Update cache
		if(this.needsUpdateEdgeCache){
			this.updateEdgeCache();
		}
		// Repulsion with elements.
		this.tick_elementRepulsion();
		// Force / Velocity / Position
		var preF: number = this.velocity.getVectorLength();
		this.velocity.x += this.currentForce.x / this.mass;
		this.velocity.y += this.currentForce.y / this.mass;
		this.currentForce.setComponent(0, 0);
		if(!this.isAnchor){
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
		}
		
		// Friction
		l = this.frictionFactor * this.mass;
		if(this.velocity.getVectorLength() > l){
			u = this.velocity.getUnitVector().getAdjustedVector(-l);
			this.velocity.addVector(u);
		} else{
			this.velocity.setComponent(0, 0);
		}
	}
	tick_elementRepulsion()
	{
		// 距離の近いElement同士には斥力が働くとする。
		var q: MGNode, nl: Array<any>, nlLen: number;
		var i: number;
		var l: number, e: Vector2D, lt: number;
		nl = this.env.db.elementList;
		nlLen = nl.length;
		
		for(i = 0; i < nlLen; i++){
			q = nl[i];
			if(q === this){
				continue;
			}
			l = this.position.getVectorLengthTo(q.position);
			lt = (this.size + q.size) * 4;
			if(l < lt && l != 0){
				e = q.position.getVectorTo(this.position);
				e.x *= (lt / l - 1) * 32;
				e.y *= (lt / l - 1) * 32;
				this.currentForce.x += e.x;
				this.currentForce.y += e.y;
				q.currentForce.x -= e.x;
				q.currentForce.y -= e.y;
			}
		}
	}
	updateEdgeCache()
	{
		this.needsUpdateEdgeCache = false;
		this.edgeCache = this.env.db.getListOfRelationConnectedWithElementID(this.elementID);
		this.size = Math.sqrt(this.edgeCache.length) * this.sizebase;
		if(this.size == 0){
			this.size = this.sizebase;
			this.fillStyle = this.FillColor_noConnection;
		} else{
			this.fillStyle = this.FillColor_connected;
		}
		this.mass = this.size * this.size * Math.PI;
	}
	loadFromDBAtomElement(e: MGDatabaseAtomElement)
	{
		this.copyFrom(e);
	}
	openContextMenu()
	{
		var that = this;
		if(!this.contextMenu){
			this.contextMenu = new CanvasUISheet(0, 0, 200, 100);
			this.env.UIManager.addChild(this.contextMenu);
			this.contextMenu.addChild(new CanvasUIButton("Close", 0, 0, 0, 0, function(){
				that.env.UIManager.removeChild(that.contextMenu);
				that.contextMenu = null;
			}));
		}
	}
	updateContextMenu()
	{
		var p: Vector2D;
		//
		if(!this.contextMenu){
			return;
		}
		//
		p = this.env.convertPointToCanvasLayerFromGraphLayerP(this.position);
		//
		this.contextMenu.origin.x = this.position.x;
		this.contextMenu.origin.y = this.position.y;
	}
	/*
	drawContextMenu()
	{
		var ctx: CanvasRenderingContext2D = this.env.context;
		var x: number = this.contextMenuRect.origin.x;
		var y: number = this.contextMenuRect.origin.y;
		var w: number = this.contextMenuRect.size.x;
		var h: number = this.contextMenuRect.size.y;
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
		ctx.strokeStyle = "rgba(51, 119, 193, 0.5)";
		ctx.fillRect(x, y, w, h);
		ctx.strokeRect(x, y, w, h);
		//
		ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
		ctx.font = "normal 32px 'Source Code Pro', source-code-pro";
		ctx.MGC_drawText("Node", x + this.size, y + this.size);
	}
	*/
}
