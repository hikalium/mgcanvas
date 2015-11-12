
interface FEqualToType{(a:any, b:any):any};

interface Array<T>
{
	removeAllObject(anObject: any): boolean;
	removeAnObject(anObject: any, fEqualTo?: FEqualToType): boolean;
	removeByIndex(index: number, length?: number): void;
	insertAtIndex(index: number, data: any): void;
	symmetricDifferenceWith(b: any, fEqualTo?: FEqualToType): Array<any>;
	intersectionWith(b: any, fEqualTo?: FEqualToType): Array<any>;
	unionWith(b: Array<any>, fEqualTo?: FEqualToType): Array<any>;
	isEqualTo(b: any, fEqualTo?: FEqualToType): boolean;
	includes(obj: any, fEqualTo?: FEqualToType): any;
	getIndex(obj: any, fEqualTo?: FEqualToType): number;
	getAllMatched(obj: any, fEqualTo?: FEqualToType): Array<any>;
	pushUnique(obj: any, fEqualTo?: FEqualToType): any;
	stableSort(f: FEqualToType): void;
	propertiesNamed(pName: any): Array<any>;
	copy(): Array<any>;
}

Array.prototype.removeAllObject = function(anObject:any){
	//Array中にある全てのanObjectを削除し、空いた部分は前につめる。
	//戻り値は削除が一回でも実行されたかどうか
	var ret:boolean = false;
	for(var i = 0; i < this.length; i++){
		if(this[i] == anObject){
			this.splice(i, 1);
			ret = true;
			i--;
		}
	}
	return ret;
}
Array.prototype.removeAnObject = function(anObject:any, fEqualTo?:FEqualToType){
	//Array中にある最初のanObjectを削除し、空いた部分は前につめる。
	//fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
	//戻り値は削除が実行されたかどうか
	if(!(fEqualTo instanceof Function)){
		fEqualTo = function(a, b){ return (a == b); };
	}
	for(var i = 0; i < this.length; i++){
		if(fEqualTo(this[i], anObject)){
			this.splice(i, 1);
			return true;
		}
	}
	return false;
}
Array.prototype.removeByIndex = function(index: number, length?: number): void
{
	//Array[index]を削除し、空いた部分は前につめる。
	if(length === undefined){
		length = 1;
	}
	this.splice(index, length);
	return;
}
Array.prototype.insertAtIndex = function(index: number, data: any): void
{
	this.splice(index, 0, data);
	return;
}
Array.prototype.symmetricDifferenceWith = function(b: any, fEqualTo?: FEqualToType): Array<any>
{
	// 対称差(XOR)集合を求める
	// fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
	var a = this.copy();
	var ei: number;
	for(var i = 0, len = b.length; i < len; i++){
		ei = a.getIndex(b[i], fEqualTo)
		if(ei != -1){
			a.removeByIndex(ei);
		} else{
			a.push(b[i]);
		}
	}
	return a;
}
Array.prototype.intersectionWith = function(b: any, fEqualTo?: FEqualToType): Array<any>
{
	//積集合（AND）を求める
	//fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
	var r = new Array();
	for(var i = 0, len = b.length; i < len; i++){
		if(this.includes(b[i], fEqualTo)){
			r.push(b[i]);
		}
	}
	return r;
}
Array.prototype.unionWith = function(b: Array<any>, fEqualTo?: FEqualToType): Array<any>
{
	//和集合（OR）を求める
	//fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
	var r = new Array();
	for(var i = 0, len = b.length; i < len; i++){
		if(!this.includes(b[i], fEqualTo)){
			r.push(b[i]);
		}
	}
	return this.concat(r);
}
Array.prototype.isEqualTo = function(b: any, fEqualTo?: FEqualToType): boolean
{
	//retv: false or true.
	//二つの配列が互いに同じ要素を同じ個数だけ持つか調べる。
	//fEqualToは省略可能で、評価関数fEqualTo(a[i], b[i])を設定する。
	//fEqualToが省略された場合、二要素が全く同一のオブジェクトかどうかによって評価される。
	var i: number, iLen: number;
	if(!(b instanceof Array) || this.length !== b.length){
		return false;
	}
	iLen = this.length;
	if(fEqualTo == undefined){
		for(i = 0; i < iLen; i++){
			if(this[i] !== b[i]){
				break;
			}
		}
	} else{
		for(i = 0; i < iLen; i++){
			if(fEqualTo(this[i], b[i])){
				break;
			}
		}
	}
	if(i === iLen){
		return true;
	}
	return false;
}
Array.prototype.includes = function(obj: any, fEqualTo?: FEqualToType){
	//含まれている場合は配列内のそのオブジェクトを返す
	//fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
	if(fEqualTo == undefined){
		for(var i = 0, len = this.length; i < len; i++){
			if(this[i] == obj){
				return this[i];
			}
		}
	} else{
		for(var i = 0, len = this.length; i < len; i++){
			if(fEqualTo(this[i], obj)){
				return this[i];
			}
		}
	}
	return false;
}
Array.prototype.getIndex = function(obj: any, fEqualTo?: FEqualToType): number
{
	// 含まれている場合は配列内におけるそのオブジェクトの添字を返す。
	// 見つからなかった場合、-1を返す。
	//fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
	if(fEqualTo == undefined){
		for(var i = 0, len = this.length; i < len; i++){
			if(this[i] == obj){
				return i;
			}
		}
	} else{
		for(var i = 0, len = this.length; i < len; i++){
			if(fEqualTo(this[i], obj)){
				return i;
			}
		}
	}
	return -1;
}
Array.prototype.getAllMatched = function(obj: any, fEqualTo?: FEqualToType): Array<any>
{
	// 評価関数が真となる要素をすべて含んだ配列を返す。
	// 返すべき要素がない場合は空配列を返す。
	// fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
	var retArray:Array<any> = new Array();
	if(fEqualTo == undefined){
		for(var i = 0, len = this.length; i < len; i++){
			if(this[i] == obj){
				retArray.push(this[i]);
			}
		}
	} else{
		for(var i = 0, len = this.length; i < len; i++){
			if(fEqualTo(this[i], obj)){
				retArray.push(this[i]);
			}
		}
	}
	return retArray;
}
/*
Array.prototype.last = function(n){
	var n = (n === undefined) ? 1 : n;
	return this[this.length - n];
}
Array.prototype.search2DLineIndex = function(column, obj, fEqualTo){
	//与えられた配列を二次元配列として解釈し
	//array[n][column]がobjと等価になる最初の行nを返す。
	//fEqualToは省略可能で、評価関数fEqualTo(array[n][column], obj)を設定する。
	//該当する行がなかった場合、戻り値はundefinedとなる。
	if(fEqualTo == undefined){
		for(var i = 0, iLen = this.length; i < iLen; i++){
			if(this[i] instanceof Array && this[i][column] == obj){
				return i;
			}
		}
	} else{
		for(var i = 0, iLen = this.length; i < iLen; i++){
			if(this[i] instanceof Array && fEqualTo(this[i][column], obj)){
				return i;
			}
		}
	}
	return undefined;
}
Array.prototype.search2DObject = function(searchColumn, retvColumn, obj, fEqualTo){
	//与えられた配列を二次元配列として解釈し
	//array[n][searchColumn]がobjと等価になる最初の行のオブジェクトarray[n][retvColumn]を返す。
	//fEqualToは省略可能で、評価関数fEqualTo(array[n][searchColumn], obj)を設定する。
	//該当する行がなかった場合、戻り値はundefinedとなる。
	if(fEqualTo == undefined){
		for(var i = 0, iLen = this.length; i < iLen; i++){
			if(this[i] instanceof Array && this[i][searchColumn] == obj){
				return this[i][retvColumn];
			}
		}
	} else{
		for(var i = 0, iLen = this.length; i < iLen; i++){
			if(this[i] instanceof Array && fEqualTo(this[i][searchColumn], obj)){
				return this[i][retvColumn];
			}
		}
	}
	return undefined;
}
*/
Array.prototype.pushUnique = function(obj: any, fEqualTo?: FEqualToType){
	//値が既に存在する場合は追加しない。評価関数fEqualTo(array[i], obj)を設定することができる。
	//結果的に配列内にあるオブジェクトが返される。
	var o = this.includes(obj, fEqualTo);
	if(!o){
		this.push(obj);
		return obj;
	}
	return o;
}
Array.prototype.stableSort = function(f: FEqualToType){
	// http://blog.livedoor.jp/netomemo/archives/24688861.html
	// Chrome等ではソートが必ずしも安定ではないので、この関数を利用する。
	if(f == undefined){
		f = function(a: any, b: any){ return a - b; };
	}
	for(var i = 0; i < this.length; i++){
		this[i].__id__ = i;
	}
	this.sort.call(this, function(a: any, b: any){
		var ret = f(a, b);
		if(ret == 0){
			return (a.__id__ > b.__id__) ? 1 : -1;
		} else{
			return ret;
		}
	});
	for(var i = 0;i < this.length;i++){
		delete this[i].__id__;
	}
}
/*
Array.prototype.splitByArray = function(separatorList){
	//Array中の文字列をseparatorList内の文字列でそれぞれで分割し、それらの文字列が含まれた配列を返す。
	var retArray = new Array();
	
	for(var i = 0, iLen = this.length; i < iLen; i++){
		retArray = retArray.concat(this[i].splitByArray(separatorList));
	}
	
	return retArray;
}
*/
Array.prototype.propertiesNamed = function(pName: any): Array<any>
{
	//Array内の各要素のプロパティpNameのリストを返す。
	var retArray = new Array<any>();
	for(var i = 0, iLen = this.length; i < iLen; i++){
		retArray.push(this[i][pName]);
	}
	return retArray;
}
/*
Array.prototype.logAsHexByte = function(logfunc){
	//十六進バイト列としてデバッグ出力する。
	//logfuncは省略時はconsole.logとなる。
	if(logfunc === undefined){
		logfunc = function(s){ console.log(s); };
	}
	var ds = "";
	for(var i = 0, iLen = this.length; i < iLen; i++){
		ds += ("00" + this[i].toString(16).toUpperCase()).slice(-2);
	}
	logfunc(ds);
}
Array.prototype.stringAsHexByte = function(){
	//十六進バイト列として文字列を得る
	var ds = "";
	for(var i = 0, iLen = this.length; i < iLen; i++){
		ds += ("00" + this[i].toString(16).toUpperCase()).slice(-2);
	}
	return ds;
}
Array.prototype.logEachPropertyNamed = function(pname, logfunc, suffix){
	//Arrayのすべての各要素pについて、プロパティp[pname]を文字列としてlogfuncの引数に渡して呼び出す。
	//suffixは各文字列の末尾に追加する文字列。省略時は改行文字となる。
	//logfuncは省略時はconsole.logとなる。
	if(logfunc === undefined){
		logfunc = function(s){ console.log(s); };
	}
	if(suffix === undefined){
		suffix = "\n";
	}
	for(var i = 0, iLen = this.length; i < iLen; i++){
		logfunc(this[i][pname] + suffix);
	}
}

Array.prototype.logEachPropertiesNamed = function(pnames, logfunc,　separator, suffix){
	//Arrayのすべての各要素pについて、プロパティp[pnames[n]]を文字列としてlogfuncの引数に渡して呼び出す。
	//suffixは各文字列の末尾に追加する文字列。省略時は改行文字となる。
	//separatorは各項目の間に置かれる文字列。省略時は",\t"となる。
	//logfuncは省略時はconsole.logとなる。
	if(logfunc === undefined){
		logfunc = function(s){ console.log(s); };
	}
	if(suffix === undefined){
		suffix = "\n";
	}
	if(separator === undefined){
		separator = ",\t";
	}
	var kLen = pnames.length - 1;
	for(var i = 0, iLen = this.length; i < iLen; i++){
		var s = "";
		for(var k = 0; k < kLen; k++){
			s += this[i][pnames[k]] + separator;
		}
		if(kLen != -1){
			s += this[i][pnames[k]] + suffix;
		}
		logfunc(s);
	}
}
*/
Array.prototype.copy = function(){
	return (new Array()).concat(this);
}

interface String
{
	splitByArraySeparatorSeparatedLong(separatorList: Array<string>): Array<string>;
	replaceAll(org: string, dest: string): string;
	escapeForHTML(): string;
}

//文字列関連
String.prototype.replaceAll = function(org: string, dest: string){
	//String中にある文字列orgを文字列destにすべて置換する。
	//http://www.syboos.jp/webjs/doc/string-replace-and-replaceall.html
	return this.split(org).join(dest);
}
/*
String.prototype.compareLeftHand = function (search){
	//前方一致長を求める。
	for(var i = 0; search.charAt(i) != ""; i++){
		if(search.charAt(i) != this.charAt(i)){
			break;
		}
	}
	return i;
}

String.prototype.splitByArray = function(separatorList){
	//リスト中の文字列それぞれで分割された配列を返す。
	//separatorはそれ以前の文字列の末尾に追加された状態で含まれる。
	//"abcdefg".splitByArray(["a", "e", "g"]);
	//	= ["a", "bcde", "fg"]
	var retArray = new Array();
	retArray[0] = this;
	
	for(var i = 0; i < separatorList.length; i++){
		var tmpArray = new Array();
		for(var k = 0; k < retArray.length; k++){
			tmpArray[k] = retArray[k].split(separatorList[i]);
			if(tmpArray[k][tmpArray[k].length - 1] == ""){
				tmpArray[k].splice(tmpArray[k].length - 1, 1);
				if(tmpArray[k] && tmpArray[k].length > 0){
					for(var m = 0; m < tmpArray[k].length; m++){
						tmpArray[k][m] += separatorList[i];
					}
				}
			} else{
				for(var m = 0; m < tmpArray[k].length - 1; m++){
					tmpArray[k][m] += separatorList[i];
				}
			}
		}
		retArray = new Array();
		retArray = retArray.concat.apply(retArray, tmpArray);
	}
	
	if(retArray.length == 0){
		// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
		//文字列が空であるとき、split メソッドは、空の配列ではなく、1 つの空文字列を含む配列を返します。
		retArray.push("");
	}
	
	return retArray;
}

String.prototype.splitByArraySeparatorSeparated = function(separatorList){
	//リスト中の文字列それぞれで分割された配列を返す。
	//separatorも分割された状態で含まれる。
	//"abcdefg".splitByArraySeparatorSeparated(["a", "e", "g"]);
	//	= ["a", "bcd", "e", "f", "g"]
	var retArray = new Array();
	retArray[0] = this;
	
	for(var i = 0; i < separatorList.length; i++){
		var tmpArray = new Array();
		for(var k = 0; k < retArray.length; k++){
			var tmpArraySub = retArray[k].split(separatorList[i]);
			tmpArray[k] = new Array();
			for(var m = 0, mLen = tmpArraySub.length - 1; m < mLen; m++){
				if(tmpArraySub[m] != ""){
					tmpArray[k].push(tmpArraySub[m]);
				}
				tmpArray[k].push(separatorList[i]);
			}
			if(tmpArraySub[tmpArraySub.length - 1] != ""){
				tmpArray[k].push(tmpArraySub[m]);
			}
		}
		retArray = new Array();
		retArray = retArray.concat.apply(retArray, tmpArray);
	}
	
	if(retArray.length == 0){
		// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
		//文字列が空であるとき、split メソッドは、空の配列ではなく、1 つの空文字列を含む配列を返します。
		retArray.push("");
	}
	
	return retArray;
}
*/
String.prototype.splitByArraySeparatorSeparatedLong = function(separatorList: Array<string>){
	//リスト中の文字列それぞれで分割された配列を返す。
	//separatorも分割された状態で含まれる。
	//separatorListの前の方にあるseparatorは、後方のseparatorによって分割されない。
	//"abcdefgcdefg".splitByArraySeparatorSeparatedLong(["bcde", "cd", "f"]);
	//	= ["a", "bcde", "f", "g", "cd", "e", "f", "g"]
	//"for (i = 0; i != 15; i++) {".splitByArraySeparatorSeparatedLong(["!=", "(", ")", "="]);
	//	= ["for ", "(", "i ", "=", " 0; i ", "!=", " 15; i++", ")", " {"]
	var retArray = new Array();
	var checkArray = new Array();
	retArray[0] = this;
	checkArray[0] = false;
	
	for(var i = 0; i < separatorList.length; i++){
		var tmpArray = new Array();
		var tmpCheckArray = new Array();
		for(var k = 0; k < retArray.length; k++){
			if(!checkArray[k]){
				var tmpArraySub = retArray[k].split(separatorList[i]);
				tmpArray[k] = new Array();
				tmpCheckArray[k] = new Array();
				for(var m = 0, mLen = tmpArraySub.length - 1; m < mLen; m++){
					if(tmpArraySub[m] != ""){
						tmpArray[k].push(tmpArraySub[m]);
						tmpCheckArray[k].push(false);
					}
					tmpArray[k].push(separatorList[i]);
					tmpCheckArray[k].push(true);
				}
				if(tmpArraySub[tmpArraySub.length - 1] != ""){
					tmpArray[k].push(tmpArraySub[m]);
					tmpCheckArray[k].push(false);
				}
			} else{
				tmpArray.push([retArray[k]]);
				tmpCheckArray.push([true]);
			}
		}
		retArray = new Array();
		checkArray = new Array();
		retArray = retArray.concat.apply(retArray, tmpArray);
		checkArray = checkArray.concat.apply(checkArray, tmpCheckArray);
	}
	
	if(retArray.length == 0){
		// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
		//文字列が空であるとき、split メソッドは、空の配列ではなく、1 つの空文字列を含む配列を返します。
		retArray.push("");
	}
	
	return retArray;
}
/*
String.prototype.trim = function(str){
	return this.replace(/^[ 　	]+|[ 　	]+$/g, "").replace(/\n$/g, "");
}
//http://d.hatena.ne.jp/favril/20090514/1242280476
String.prototype.isKanjiAt = function(index){
	var u = this.charCodeAt(index);
	if( (0x4e00  <= u && u <= 0x9fcf) ||	// CJK統合漢字
		(0x3400  <= u && u <= 0x4dbf) ||	// CJK統合漢字拡張A
		(0x20000 <= u && u <= 0x2a6df) ||	// CJK統合漢字拡張B
		(0xf900  <= u && u <= 0xfadf) ||	// CJK互換漢字
		(0x2f800 <= u && u <= 0x2fa1f)){ 	// CJK互換漢字補助
		return true;
	}
    return false;
}
String.prototype.isHiraganaAt = function(index){
	var u = this.charCodeAt(index);
	if(0x3040 <= u && u <= 0x309f){
		return true;
	}
	return false;
}
String.prototype.isKatakanaAt = function(index){
	var u = this.charCodeAt(index);
	if(0x30a0 <= u && u <= 0x30ff){
		return true;
	}
	return false;
}
String.prototype.isHankakuKanaAt = function(index){
	var u = this.charCodeAt(index);
	if(0xff61 <= u && u <= 0xff9f){
		return true;
	}
	return false;
}
*/
String.prototype.escapeForHTML = function(){
	var e = document.createElement('div');
	e.appendChild(document.createTextNode(this));
	return e.innerHTML;
}

// http://stackoverflow.com/questions/641857/javascript-window-resize-event
// addEvent(window, "resize", function_reference);
var addEvent = function(elem: any, type: string, eventHandle: Function) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
};
