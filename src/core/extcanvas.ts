interface CanvasRenderingContext2D
{
	MGC_drawCircle(x: number, y: number, r: number): void;
	MGC_drawLine(p: Vector2D, q: Vector2D): void;
	MGC_drawArrowLine(p: Vector2D, q: Vector2D, headSize?: number): void;
	MGC_drawText(text: string, x: number, y: number): void;
}

CanvasRenderingContext2D.prototype.MGC_drawCircle = function(x: number, y: number, r: number){
	this.beginPath();
	this.arc(x, y, r, 0, 2 * Math.PI);
	this.closePath();
	this.fill();
	this.stroke();
};
CanvasRenderingContext2D.prototype.MGC_drawLine = function(p: Vector2D, q: Vector2D){
	this.beginPath();
	this.moveTo(p.x, p.y);
	this.lineTo(q.x, q.y);
	this.closePath();
	this.stroke();
};
CanvasRenderingContext2D.prototype.MGC_drawArrowLine = function(p: Vector2D, q: Vector2D, headSize?: number){
	// pからqに向かう矢印つき線分を描く
	var b: Vector2D, d: Vector2D;
	headSize = headSize ? headSize : 16;
	this.MGC_drawLine(p, q);
	b = q.getVectorTo(p);
	b = b.getAdjustedVector(headSize);
	d = b.getRotatedVector(Math.PI / 6);
	this.MGC_drawLine(q, q.getCompositeVector(d));
	d = b.getRotatedVector(-Math.PI / 6);
	this.MGC_drawLine(q, q.getCompositeVector(d));
};
CanvasRenderingContext2D.prototype.MGC_drawText = function(text: string, x: number, y: number){
	//背景をfillStyle
	//前景をstrokeStyleで塗りつぶした文字列を描画する
	//塗りつぶし高さは20px固定
	//座標は文字列の左上の座標となる
	var textsize = this.measureText(text);
	this.fillRect(x, y, textsize.width, 20);
	this.save();
	this.fillStyle = this.strokeStyle;
	//fillText引数の座標は文字列の左下！
	this.fillText(text, x, y + 20 - 1);
	this.restore();
};

