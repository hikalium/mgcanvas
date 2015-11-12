//
// Vector2D
//
class Vector2D
{
	public x: number;
	public y: number;
	//
	constructor(x?: number, y?: number)
	{
		this.x = (x === undefined) ? 0 : x;
		this.y = (y === undefined) ? 0 : y;
	}
	// Change this element.
	setComponent(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}
	addVector(p: Vector2D)
	{
		var v = this.getCompositeVector(p);
		this.setComponent(v.x, v.y);
	}
	// Get scalar value.
	getVectorLength(): number
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	getDistanceFromPoitToLine(a: Vector2D, b: Vector2D): number
	{
		// この位置ベクトルが示す点と、ベクトルabとの距離を求める。
		// ベクトルabは線分として計算される（直線ではない）。
		// http://www.sousakuba.com/Programming/gs_dot_line_distance.html
		var ab: Vector2D;
		var ap: Vector2D;
		var s: number;
		var l: number;
		var d: number;
		
		ab = a.getVectorTo(b);
		ap = a.getVectorTo(this);
		
		s = Math.abs(Vector2D.crossProduct(ab, ap));
		l = ab.getVectorLength();
		d = (s / l);
		
		s = Vector2D.innerProduct(ap, ab);
		if(s < 0){
			//線分の範囲外なので端点aからの距離に変換
			//端点から垂線の足までの距離
			l = - (s / l);
			d = Math.sqrt(d * d + l * l);
		} else if(s > l * l){
			//同様に端点bからの距離に変換
			l = s / l;
			d = Math.sqrt(d * d + l * l);
		}
		return d;
	}
	// Get new Vector2D.
	getVectorCopy(): Vector2D
	{
		return new Vector2D(this.x, this.y);
	}
	getVectorTo(dest: Vector2D): Vector2D
	{
		return new Vector2D(dest.x - this.x, dest.y - this.y);
	}
	getVectorLengthTo(dest: Vector2D): number
	{
		return this.getVectorTo(dest).getVectorLength();
	}
	getUnitVectorTo(dest: Vector2D): Vector2D
	{
		var e = this.getVectorTo(dest);
		return e.getUnitVector();
	}
	getUnitVector(): Vector2D
	{
		var l = this.getVectorLength();
		return this.getVectorScalarMultiplied(1 / l);
	}
	getVectorScalarMultiplied(n: number): Vector2D
	{
		var v = this.getVectorCopy();
		v.x *= n;
		v.y *= n;
		return v;
	}
	getInverseVector(): Vector2D
	{
		return new Vector2D(-this.x, -this.y);
	}
	getRotatedVector(t: number, s?: number, c?: number): Vector2D
	{
		// s, cは省略可能。sin, cosの計算済みの値を渡すことで高速化できる。
		var s = s ? s : Math.sin(t);
		var c = c ? c : Math.cos(t);
		return new Vector2D(this.x * c - this.y * s, this.x * s + this.y * c);
	}
	getAdjustedVector(len: number): Vector2D
	{
		var p = this.getVectorLength();
		if(p == 0 || len == 0){
			return new Vector2D(0, 0);
		}
		p = len / p;
		return new Vector2D(this.x * p, this.y * p);
	}
	getCompositeVector(p: any): Vector2D
	{
		var v = this.getVectorCopy();
		if(p instanceof Array){
			var q: Vector2D;
			for(var i = 0, iLen = p.length; i < iLen; i++){
				q = p[i];
				v.x += q.x;
				v.y += q.y;
			}
		} else if(p instanceof Vector2D){
			v.x += p.x;
			v.y += p.y;
		}
		return v;
	}
	//
	static crossProduct(a: Vector2D, b: Vector2D): number
	{
		return a.x * b.y - a.y * b.x;
	}
	static innerProduct(a: Vector2D, b: Vector2D): number
	{
		return a.x * b.x + a.y * b.y;
	}
	static getMeanVector(vl: Array<Vector2D>): Vector2D
	{
		var g = new Vector2D();
		var i: number, iLen: number = vl.length;
		
		for(i = 0; i < iLen; i++){
			g.x += vl[i].x;
			g.y += vl[i].y;
		}
		g.x /= iLen;
		g.y /= iLen;
		
		return g;
	}
	static getNormalUnitVectorSideOfP(a: Vector2D, b: Vector2D, p: Vector2D): Vector2D
	{
		//直線ab上にない点pが存在する側へ向かう単位法線ベクトルを返す。
		return this.getNormalVectorSideOfP(a, b, p).getUnitVector();
	}
	static getNormalVectorSideOfP(a: Vector2D, b: Vector2D, p: Vector2D): Vector2D
	{
		//直線ab上にない点pが存在する側へ向かう法線ベクトルを返す。
		//pがab上にある場合は零ベクトルとなる。
		var n: Vector2D = a.getVectorTo(b);
		var t: number = n.x;
		var i: number;
		n.x = -n.y;
		n.y = t;
		
		i = Vector2D.innerProduct(n, a.getVectorTo(p));
		if(i < 0){
			//この法線ベクトルとapの向きが逆なので反転する。
			n.x = -n.x;
			n.y = -n.y;
		} else if(i == 0){
			n.x = 0;
			n.y = 0;
		}
		return n;
	}

}