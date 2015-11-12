class Rectangle2D
{
	public origin: Vector2D;
	public size: Vector2D;
	constructor(x?: number, y?: number, w?: number, h?: number)
	{
		this.origin = new Vector2D(x, y);
		this.size = new Vector2D(w, h);
	}
	//
	includesPoint(p: Vector2D): boolean
	{
		return 	(this.origin.x <= p.x) && (p.x <= this.origin.x + this.size.x) &&
				(this.origin.y <= p.y) && (p.y <= this.origin.y + this.size.y);
	}
}