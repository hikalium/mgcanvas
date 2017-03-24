
class MGEdge extends MGDatabaseRelationElement implements MGGraphElement
{
	StrokeColor_default: string	= "rgba(51, 119, 193, 0.5)";
	StrokeColor_selected: string	= "rgba(255, 0, 0, 1)";
	FillColor_default: string	= "rgba(255, 255, 255, 0);";	
	//
	position: Vector2D;		// [px]
	velocity: Vector2D;		// [px / tick]
	currentForce: Vector2D;	// [px / tick^2]
	//
	naturalLength: number			= 100;
	springRate: number				= 10;
	elementCache: Array<any>		= new Array();
	lineWidth: number				= 2;
	isSelected: boolean				= false;
	isAnchor: boolean				= false;
	frictionFactor: number			= 0.015;
	size: number					= 8;
	needsUpdateEdgeCache: boolean	= false;
	typeElementCache: MGDatabaseElement;
	fillStyle: string;
	strokeStyle: string;
	mass: number;
	ignoreDescriptionList = ["type"];
	//
	env: MGCanvas;
	//
	constructor(typeid?: string, elementIDList?: Array<string>)
	{
		// e[0]に矢印マークがつく。
		// 時計回りにeは配置される。
		super(typeid, elementIDList);	
		// Kinetic attributes
		this.position = new Vector2D(Math.random() * 64 - 32, Math.random() * 64 - 32);	// [px]
		this.velocity = new Vector2D(0, 0);	// [px / tick]
		this.currentForce = new Vector2D(0, 0);	// [px / tick^2]
		//
		this.strokeStyle = this.StrokeColor_default;
		this.mass = 10 * 10 * Math.PI;
	}
	//
	draw()
	{
		if(this.isIgnored()) return;
		var ctx = this.env.context;
		//
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;
		//ctx.font = this.font;
		if(this.isSelected){
			this.env.context.strokeStyle = this.StrokeColor_selected;
		} else{
			this.env.context.strokeStyle = this.strokeStyle;
			this.env.context.fillStyle = this.FillColor_default;
		}
		this.env.context.lineWidth = this.lineWidth;
		//
		this.drawEdgeLine();
		ctx.strokeRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
		if(this.typeElementCache && this.typeElementCache instanceof MGDatabaseAtomElement){
			ctx.MGC_drawText((<MGDatabaseAtomElement>this.typeElementCache).contents, this.position.x, this.position.y);
		}
		// for Debug
		var pTo: Vector2D;
		ctx.strokeStyle = "rgba(255, 183, 19, 0.5)";
		pTo = this.position.getCompositeVector(this.velocity.getVectorScalarMultiplied(100));
		ctx.MGC_drawArrowLine(this.position, pTo);
	}
	tick()
	{
		if(this.isIgnored()) return;
		this.tick_node();
		this.tick_connection();
	}
	tick_node()
	{
		var u: Vector2D;
		var l: number;
		
		// Update cache
		this.checkAndUpdateCache();
		// Force / Velocity / Position
		if(this.elementCache.length <= 1){
			this.velocity.x += this.currentForce.x / this.mass;
			this.velocity.y += this.currentForce.y / this.mass;
			this.currentForce.setComponent(0, 0);
		}
		
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
	tick_connection()
	{
		// el.length >= 2
		var i: number, iLen: number;
		var x: number, y: number;
		var el: Array<MGGraphElement> = this.elementCache;
		
		iLen = el.length;
		if(iLen < 2){
			if(iLen == 1){
				this.applySpringForce(this.position, el[0]);
				this.applySpringForce(el[0].position, this);
			}
			//this.currentForce.setComponent(0, 0);
			//this.velocity.setComponent(0, 0);
			return;
		}
		//
		this.position = this.getCenterPoint();
		for(i = 0; i < iLen; i++){
			this.applySpringForce(this.position, el[i]);
		}
		// Force
		x = this.currentForce.x / iLen;
		y = this.currentForce.y / iLen;
		for(i = 0; i < iLen; i++){
			el[i].currentForce.x += x;
			el[i].currentForce.y += y;
		}
		this.currentForce.setComponent(0, 0);
		//this.velocity.setComponent(0, 0);
	}
	applySpringForce(basePos: Vector2D, targetElement: MGGraphElement)
	{
		var cl: number, cf: number, u: Vector2D;
		//
		if(!targetElement || !basePos) return;
		cl = basePos.getVectorTo(targetElement.position).getVectorLength();
		cf = (this.naturalLength - cl) * this.springRate;
		u = targetElement.position.getUnitVectorTo(basePos).getAdjustedVector(-cf);
		if(isNaN(u.x) || isNaN(u.y)){
			return;
		}
		if(targetElement instanceof MGNode || targetElement instanceof MGEdge){
			targetElement.currentForce.addVector(u);
		}
	}
	drawEdgeLine()
	{
		var p: Vector2D;
		var n: Array<any> = this.elementCache;
		var cp: Vector2D = this.position;
		var l: Vector2D;
		var ctx: CanvasRenderingContext2D = this.env.context;
		var i: number, iLen: number = n.length;

		if(iLen > 2){
			for(i = 0; i < iLen; i++){
				l = this.position.getVectorTo(n[i].position);
				l = l.getAdjustedVector(l.getVectorLength() - n[i].size);
				ctx.MGC_drawLine(this.position, this.position.getCompositeVector(l));
				l = l.getAdjustedVector(l.getVectorLength() / 2);
				l = this.position.getCompositeVector(l);
				ctx.MGC_drawText(i.toString(10), l.x, l.y);
			}
		} else if(iLen == 2){
			l = n[1].position.getVectorTo(n[0].position);
			l = l.getAdjustedVector(l.getVectorLength() - n[1].size - n[0].size);
			p = n[1].position.getCompositeVector(l.getAdjustedVector(n[1].size));
			ctx.MGC_drawArrowLine(p, p.getCompositeVector(l));
		} else if(iLen == 1){
			if(!n[0])return;
			l = this.position.getVectorTo(n[0].position);
			l = l.getAdjustedVector(l.getVectorLength() - n[0].size);
			p = this.position;
			ctx.MGC_drawArrowLine(p, p.getCompositeVector(l));
		}

	}
	checkAndUpdateCache()
	{
		var i: number;
		if(!this.typeElementCache || this.typeElementCache.elementID != this.typeElementID){
			this.typeElementCache = this.env.db.getElementByID(this.typeElementID);
		}
		if(!this.elementCache.isEqualTo(this.elementIDList, this.env.db.fEqualTo_elementList_elementID)){
			this.updateElementCache();
		}
	}
	updateElementCache()
	{
		var i: number, iLen: number;
		var diff: Array<any>;
		diff = this.elementCache;
		//
		iLen = this.elementIDList.length;
		this.elementCache = new Array();
		for(i = 0; i < iLen; i++){
			this.elementCache[i] = this.env.db.getElementByID(this.elementIDList[i]);
		}
		//
		diff = diff.symmetricDifferenceWith(this.elementCache);
		iLen = diff.length;
		for(i = 0; i < iLen; i++){
			diff[i].needsUpdateEdgeCache = true;
		}
	}
	getCenterPoint()
	{
		var g: Vector2D = new Vector2D();
		var el: Array<any> = this.elementCache;
		var i: number, iLen: number = el.length;
		
		for(i = 0; i < iLen; i++){
			g.x += el[i].position.x;
			g.y += el[i].position.y;
		}
		g.x /= iLen;
		g.y /= iLen;
		
		return g;
	}
	isIgnored()
	{
		if(this.typeElementCache instanceof MGDatabaseAtomElement &&
			this.ignoreDescriptionList.includes((<MGDatabaseAtomElement>this.typeElementCache).contents)){
			return true;
		}
		var el: Array<MGGraphElement> = this.elementCache;
		for(var i = 0; i < el.length; i++){
			if(el[i].isIgnored()) return true;
		}
		
		return false;
	}
}
