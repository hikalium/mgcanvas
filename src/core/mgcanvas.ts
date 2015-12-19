
interface MGGraphElement extends MGDatabaseElement
{
	position: Vector2D;		// [px]
	velocity: Vector2D;		// [px / tick]
	currentForce: Vector2D;	// [px / tick^2]
}

enum CallbackEventID
{
	NodeSelectionChanged = 1,
	EdgeSelectionChanged = 2,
}

class MGCanvas
{
	tickPerSecond: number = 30;
	//
	db: MGDatabase;
	tickCount: number = 0;
	tickTimer: any;
	isPaused: boolean = false;
	isEnabledAutomaticTracking: boolean = false;
	isMouseDown: boolean = false;
	isClick: boolean = false;
	mouseDownPosition: Vector2D = new Vector2D(0, 0);
	lastMousePosition: Vector2D = new Vector2D(0, 0);
	grabbedNode: any = null;
	needsRefreshObjectData: boolean = false;
	nodeSelectionList: Array<any> = new Array();
	edgeSelectionList: Array<any> = new Array();
	eventHandler: Function = null;
	context: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	currentScale: number = 1;
	positionOffset: Vector2D;
	displayRect: Rectangle2D;
	regulationList: Array<Function> = new Array();
	UIManager: CanvasUIManager;
	/*
		function(eventID, [args])
		NodeSelectionChanged			function(1, [newNodeInstance, nodeSelectionList]){};
		EdgeSelectionChanged			function(2, [newEdgeInstance, edgeSelectionList]){};
	*/
	//
	constructor(db: MGDatabase, canvasDOMObj: HTMLCanvasElement, GUIControlEnabled: boolean){
		var that = this;
		var f: EventListener;
		//
		this.initGraphicContext(canvasDOMObj);
		this.UIManager = new CanvasUIManager(this.context);
		//
		this.tickTimer = window.setInterval(function(){ that.tick(); }, 1000 / this.tickPerSecond);
		//
		this.db = (db instanceof MGDatabase) ? db : new MGDatabase();
		this.db.eventHandler_attemptToAddAtom = function(e: MGDatabaseAtomElement, db: MGDatabase){
			return that.attemptToAddAtom(e, db);
		};
		this.db.eventHandler_attemptToAddRelation = function(e: MGDatabaseRelationElement, db: MGDatabase){
			return that.attemptToAddRelation(e, db);
		};
		//
		if(GUIControlEnabled){
			//
			// Mouse
			//
			/* down */
			f = function (e: any){
				var node: MGNode;
				var pGraph: Vector2D;
				if(e.button === 0){
					// left button
					that.lastMousePosition = that.getPointerPositionOnElement(e);
					that.mouseDownPosition = that.lastMousePosition;
					that.isMouseDown = true;
					that.isClick = true;
					that.isEnabledAutomaticTracking = false;
					//e.preventDefault();
					pGraph = that.convertPointToGraphLayerFromCanvasLayerP(that.lastMousePosition);
					node = that.getNodeAtPoint(pGraph);
					if(node){
						that.grabbedNode = node;
					} else{
						that.UIManager.mouseDown(pGraph);
					}
				}
			};
			this.canvas.addEventListener("mousedown", f, false);
			/* right down default prevent */
			f = function (e: any){
				var p = that.getPointerPositionOnElement(e);
				var pGraph = that.convertPointToGraphLayerFromCanvasLayerP(p);
				var node = that.getNodeAtPoint(pGraph);
				if(node){
					e.preventDefault();
					//
					if(node.openContextMenu){
						node.openContextMenu();
					}
				}
			};
			this.canvas.addEventListener("contextmenu", f, false);
			/* move */
			f = function (e: any){
				var currentMousePosition: Vector2D;
				if(that.isMouseDown){
					currentMousePosition = that.getPointerPositionOnElement(e);
					if(!that.grabbedNode){
						// View moving with mouse
						that.moveViewRelative(
							(that.lastMousePosition.x - currentMousePosition.x) / that.currentScale,
							(that.lastMousePosition.y - currentMousePosition.y) / that.currentScale
						);
					}
					that.lastMousePosition = currentMousePosition;
				}
				that.isClick = false;
				e.preventDefault();
			};
			this.canvas.addEventListener("mousemove", f, false);
			if(window.TouchEvent && window.addEventListener){
				this.canvas.addEventListener("touchmove", f, false);
			}
			/* up */
			f = function (e: any){
				that.isMouseDown = false;
				that.grabbedNode = null;
				if(that.isClick){
					var p = that.convertPointToGraphLayerFromCanvasLayerP(that.lastMousePosition);
					var node = that.getNodeAtPoint(p);
					that.selectNode(node, e.shiftKey);
					var edge = that.getEdgeAtPoint(p);
					that.selectEdge(edge, e.shiftKey);
					that.isClick = false;
				}
			};
			this.canvas.addEventListener("mouseup", f, false);
			if(window.TouchEvent && window.addEventListener){
				this.canvas.addEventListener("touchend", f, false);
			}
			//
			// Touch
			//
			if(window.TouchEvent && window.addEventListener){
				f = function (e: any){
					var node: MGNode;
					var pGraph: Vector2D;
					if(e.touches.length === 1){
						// left button
						that.lastMousePosition = that.getPointerPositionOnElement(e);
						that.mouseDownPosition = that.lastMousePosition;
						that.isMouseDown = true;
						that.isClick = true;
						that.isEnabledAutomaticTracking = false;
						//e.preventDefault();
						pGraph = that.convertPointToGraphLayerFromCanvasLayerP(that.lastMousePosition);
						node = that.getNodeAtPoint(pGraph);
						if(node){
							that.grabbedNode = node;
						} else{
							that.UIManager.mouseDown(pGraph);
						}
					}
				};
				this.canvas.addEventListener("touchstart", f, false);
			}
		}
	}
	//
	globalRegulation: Object = {
		nodeRepulsionWithEdge: function(env: MGCanvas){
			// 自分を端点に含まないEdgeとの距離が近い場合、そのエッジから遠ざかろうとする。
			var p: MGNode, nl: Array<MGNode>, nlLen: number, i: number;	// aNode
			var q: MGEdge, el: Array<MGEdge>, elLen: number, k: number;	// anEdge
			var l: number, e: Vector2D, lt: number;
			var ec: Array<any>;
			//
			nl = <Array<MGNode>>env.db.atomList;
			el = <Array<MGEdge>>env.db.relationList;
			nlLen = nl.length;
			elLen = el.length;
			//
			for(i = 0; i < nlLen; i++){
				p = nl[i];
				lt = p.size * 8;
				for(k = 0; k < elLen; k++){
					q = el[k];
					ec = q.elementCache;
					if(ec.length == 2 && ec[0]){
						if(ec[0] && ec[1] && ec[0] != p && ec[1] != p){
							l = p.position.getDistanceFromPoitToLine(ec[0].position, ec[1].position);
							if(l < lt && l != 0){
								if(l < 1){
									// あまりに近すぎると反発力が強くなりすぎるので調整
									l = 1;
								}
								if(p.velocity.getVectorLength() > 5){
									break;
								}
								e = Vector2D.getNormalUnitVectorSideOfP(ec[0].position, ec[1].position, p.position);
								e.x *= lt / l;
								e.y *= lt / l;
								p.velocity.x += e.x;
								p.velocity.y += e.y;
								ec[0].velocity.x -= e.x;
								ec[0].velocity.y -= e.y;
								ec[1].velocity.x -= e.x;
								ec[1].velocity.y -= e.y;
							}
						}
					}
				}
			}
		},
	}
	//
	/*
	resetEnvironment(){
		for(var i = 0, iLen = this.edgeList.length; i < iLen; i++){
			this.removeEdge(this.edgeList[0]);
		}
		for(var i = 0, iLen = this.nodeList.length; i < iLen; i++){
			this.removeNode(this.nodeList[0]);
		}
	}
	*/
	/*
	setGraphWithNodeContents(gArray){
		// 文字列からグラフを生成する。
		//gArray = [[Node1, Node2, Node3, ...], [[Node1, Node3], [Node3, Node2], ...]]
		var that = this;
		var p = gArray[0];
		var tnl = new Array();
		var n = function(contents){ return tnl.includes(contents, function(a, b){ return (a.contents == b); }); };

		for(var i = 0, iLen = p.length; i < iLen; i++){
			var node = new MGNode(p[i]);
			this.addNode(node);
			tnl.push(node);
		}

		p = gArray[1];
		for(var i = 0, iLen = p.length; i < iLen; i++){
			this.addEdge(new MGEdge(n(p[i][0]).nodeid, n(p[i][1]).nodeid));
		}
	}
	*/
	/*
	setGraphWithObjectArray(nodeArray, edgeArray){
		for(var i = 0, iLen = nodeArray.length; i < iLen; i++){
			this.addNode(nodeArray[i]);
		}
		for(var i = 0, iLen = edgeArray.length; i < iLen; i++){
			this.addEdge(edgeArray[i]);
		}
	}
	*/
	//
	// DB event handler
	//
	attemptToAddAtom(e: MGDatabaseAtomElement, db: MGDatabase){
		var ne = new MGNode();
		ne.copyFrom(e);
		ne.env = this;
		return ne;
	}
	attemptToAddRelation(e: MGDatabaseRelationElement, db: MGDatabase){
		var ne = new MGEdge();
		ne.copyFrom(e);
		ne.env = this;
		return ne;
	}
	//
	// add / update / remove
	//
	addRegulation(f: Function){
		if(f instanceof Function){
			this.regulationList.push(f);
		} else{
			console.log("Invalid regulation.")
		}
	}
	//
	// Other functions
	//
	bringToCenter(){
		// 重心を求めて、それを表示オフセットに設定する
		var g: Vector2D = new Vector2D(0, 0);
		var p: Array<MGNode>;
		p = <Array<MGNode>>this.db.atomList;
		for(var i = 0, iLen = p.length; i < iLen; i++){
			g.x += p[i].position.x;
			g.y += p[i].position.y;
		}
		g.x /= p.length;
		g.y /= p.length;

		this.positionOffset.x = -g.x;
		this.positionOffset.y = -g.y;

		this.isEnabledAutomaticTracking = true;
	}
	zoomIn(){
		this.context.scale(2, 2);
		this.currentScale *= 2;
	}
	zoomOut(){
		this.context.scale(0.5, 0.5);
		this.currentScale *= 0.5;
	}
	moveViewAbsolute(x: number, y: number){
		// change center point of view to (x, y).
		// in canvas coordinate (not view coordinate).
		this.positionOffset.x = -x;
		this.positionOffset.y = -y;
	}
	moveViewRelative(x: number, y: number){
		this.positionOffset.x += -x;
		this.positionOffset.y += -y;
	}
	bringInScreen(){
		//大きく外れていないときには動かさない
		var g: Vector2D = new Vector2D(0, 0);
		var f: Vector2D = new Vector2D(0, 0);
		var p: Array<MGNode>;
		var i: number, iLen: number;
		//
		p = <Array<MGNode>>this.db.atomList;
		for(i = 0, iLen = p.length; i < iLen; i++){
			g.x += p[i].position.x;
			g.y += p[i].position.y;
		}
		g.x /= p.length;
		g.y /= p.length;
		g.x += this.positionOffset.x;
		g.y += this.positionOffset.y;
		if(	g.x < this.displayRect.origin.x / 2 ||
			g.x > -this.displayRect.origin.x / 2 ||
			g.y < this.displayRect.origin.y / 2 ||
			g.y > -this.displayRect.origin.x / 2){

			this.positionOffset.x += -g.x;
			this.positionOffset.y += -g.y;
		}
	}
	tick(){
		var p: any;
		var i: number, iLen: number;
		var dr: Rectangle2D;

		this.tickCount++;

		//
		// AutomaticTracking
		//
		if(this.isEnabledAutomaticTracking && (this.tickCount % 30 == 0)){
			this.bringInScreen();
		}

		//
		// grabbedNode
		//
		if(this.grabbedNode){
			p = this.convertPointToGraphLayerFromCanvasLayerP(this.lastMousePosition);
			this.grabbedNode.position.x = p.x;
			this.grabbedNode.position.y = p.y;
		}

		//
		// Node and Edge
		//
		if(!this.isPaused){
			//
			// Move & Compute
			//
			p = this.db.elementList;
			for(i = 0, iLen = p.length; i < iLen; i++){
				p[i].tick();
			}
			//
			this.needsRefreshObjectData = false;
		}

		//
		// Refresh
		//
		dr = this.displayRect;

		this.context.scale(1 / this.currentScale, 1 / this.currentScale);
		this.context.clearRect(dr.origin.x, dr.origin.y, dr.size.x, dr.size.y);
		this.context.scale(this.currentScale, this.currentScale);

		this.context.translate(this.positionOffset.x, this.positionOffset.y);
		//
		p = this.db.elementList;
		for(i = 0, iLen = p.length; i < iLen; i++){
			p[i].draw();
		}
		this.UIManager.tick();
		//
		this.context.translate(-this.positionOffset.x, -this.positionOffset.y);
	}
	getPointerPositionOnElement(e: any){
		// http://tmlife.net/programming/javascript/javascript-mouse-pos.html
		// retv:
		var retv = new Vector2D();
		var rect: any;
		var p: any;
		if(!e){
			//for IE
			e = window.event;
		}
		if(e.changedTouches){
			p = e.changedTouches[0];
		} else{
			p = e;
		}
		rect = e.target.getBoundingClientRect();
		retv.x = p.clientX - rect.left;
		retv.y = p.clientY - rect.top;
		return retv;
	}
	initGraphicContext(newCanvas: HTMLCanvasElement)
	{
		this.canvas = newCanvas;
		this.context = this.canvas.getContext('2d');
		this.context.fillStyle = "rgba(255,255,255,0.5)";
		this.context.strokeStyle = "rgba(0, 0, 0, 1)";
		this.context.font = "normal 20px sans-serif";
		var w = this.canvas.width / 2;
		var h = this.canvas.height / 2;
		this.context.translate(w, h);
		this.displayRect = new Rectangle2D(-w, -h, this.canvas.width, this.canvas.height);
		this.currentScale = 1;
		//this.zoomOut();
		this.positionOffset = new Vector2D(0, 0);
	}
	convertPointToGraphLayerFromCanvasLayerP(pCanvas: Vector2D): Vector2D
	{
		var p = new Vector2D(pCanvas.x, pCanvas.y);
		// Canvasの中心が原点
		p.x -= this.canvas.width / 2;
		p.y -= this.canvas.height / 2;
		// スケール変換
		p.x /= this.currentScale;
		p.y /= this.currentScale;

		// オフセット平行移動
		p.x -= this.positionOffset.x;
		p.y -= this.positionOffset.y;

		return p;
	}
	convertPointToCanvasLayerFromGraphLayerP(pGraph: Vector2D): Vector2D
	{
		var p = new Vector2D(pGraph.x, pGraph.y);
		// オフセット平行移動
		p.x += this.positionOffset.x;
		p.y += this.positionOffset.y;
		// スケール変換
		p.x *= this.currentScale;
		p.y *= this.currentScale;
		// Canvasの中心が原点
		p.x += this.canvas.width / 2;
		p.y += this.canvas.height / 2;

		return p;
	}
	getNodeAtPoint(p: Vector2D): any
	{
		var nl: Array<MGNode> = <Array<MGNode>>this.db.atomList;
		for(var i = 0, iLen = nl.length; i < iLen; i++){
			var k = nl[i].size;
			var r = new Rectangle2D(nl[i].position.x - k, nl[i].position.y - k, 2 * k, 2 * k);
			if(r.includesPoint(p)){
				return nl[i];
			}
		}
		return null;
	}
	getEdgeAtPoint(p: Vector2D): any
	{
		/*
		var r = new Rectangle(p.x - 10, p.y - 10, 20, 20);

		var el = this.edgeList;
		for(var i = 0, iLen = el.length; i < iLen; i++){
			if(r.includesPoint(el[i].position)){
				return el[i];
			}
		}
		*/
		return null;
	}
	selectNode(node: any, isMultiSelection: boolean){
		this.selectSub(node, isMultiSelection, this.nodeSelectionList, CallbackEventID.NodeSelectionChanged);
	}
	selectEdge(edge: any, isMultiSelection: boolean){
		this.selectSub(edge, isMultiSelection, this.edgeSelectionList, CallbackEventID.EdgeSelectionChanged);
	}
	selectSub(obj: any, isMultiSelection: boolean, list: Array<any>, callbackEventID: number){
		if(!isMultiSelection){
			for(var i = 0, iLen = list.length; i < iLen; i++){
				this.selectSub_setSelectionState(list[0], false, list, callbackEventID);
			}
		}
		this.selectSub_setSelectionState(obj, !list.includes(obj), list, callbackEventID);
	}
	selectSub_setSelectionState(obj: any, state: boolean, list: Array<any>, callbackEventID: number){
		if(!obj){
			return;
		}
		var t = list.includes(obj);
		if(t == state){
			return;
		} else{
			if(state){
				list.push(obj);
				obj.isSelected = true;
			} else{
				list.removeAnObject(obj);
				obj.isSelected = false;
			}
			if(this.eventHandler){
				this.eventHandler(callbackEventID, [obj, list]);
			}
		}
	}
	resizeTo(w: number, h: number){
		// スケール変換を戻す
		this.context.scale(1 / this.currentScale, 1 / this.currentScale);
		// 左上原点に戻す
		this.context.translate(this.displayRect.origin.x, this.displayRect.origin.y);
		// 再設定
		this.canvas.width = w;
		this.canvas.height = h;
		w = w / 2;
		h = h / 2;
		this.displayRect = new Rectangle2D(-w, -h, this.canvas.width, this.canvas.height);
		// 中心原点に再設定
		this.context.translate(w, h);
		// スケール変換を再設定
		this.context.scale(this.currentScale, this.currentScale);

		return 0;
	}
}
