;
Array.prototype.removeAllObject = function (anObject) {
    //Array中にある全てのanObjectを削除し、空いた部分は前につめる。
    //戻り値は削除が一回でも実行されたかどうか
    var ret = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == anObject) {
            this.splice(i, 1);
            ret = true;
            i--;
        }
    }
    return ret;
};
Array.prototype.removeAnObject = function (anObject, fEqualTo) {
    //Array中にある最初のanObjectを削除し、空いた部分は前につめる。
    //fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
    //戻り値は削除が実行されたかどうか
    if (!(fEqualTo instanceof Function)) {
        fEqualTo = function (a, b) { return (a == b); };
    }
    for (var i = 0; i < this.length; i++) {
        if (fEqualTo(this[i], anObject)) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
};
Array.prototype.removeByIndex = function (index, length) {
    //Array[index]を削除し、空いた部分は前につめる。
    if (length === undefined) {
        length = 1;
    }
    this.splice(index, length);
    return;
};
Array.prototype.insertAtIndex = function (index, data) {
    this.splice(index, 0, data);
    return;
};
Array.prototype.symmetricDifferenceWith = function (b, fEqualTo) {
    // 対称差(XOR)集合を求める
    // fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
    var a = this.copy();
    var ei;
    for (var i = 0, len = b.length; i < len; i++) {
        ei = a.getIndex(b[i], fEqualTo);
        if (ei != -1) {
            a.removeByIndex(ei);
        }
        else {
            a.push(b[i]);
        }
    }
    return a;
};
Array.prototype.intersectionWith = function (b, fEqualTo) {
    //積集合（AND）を求める
    //fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
    var r = new Array();
    for (var i = 0, len = b.length; i < len; i++) {
        if (this.includes(b[i], fEqualTo)) {
            r.push(b[i]);
        }
    }
    return r;
};
Array.prototype.unionWith = function (b, fEqualTo) {
    //和集合（OR）を求める
    //fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
    var r = new Array();
    for (var i = 0, len = b.length; i < len; i++) {
        if (!this.includes(b[i], fEqualTo)) {
            r.push(b[i]);
        }
    }
    return this.concat(r);
};
Array.prototype.isEqualTo = function (b, fEqualTo) {
    //retv: false or true.
    //二つの配列が互いに同じ要素を同じ個数だけ持つか調べる。
    //fEqualToは省略可能で、評価関数fEqualTo(a[i], b[i])を設定する。
    //fEqualToが省略された場合、二要素が全く同一のオブジェクトかどうかによって評価される。
    var i, iLen;
    if (!(b instanceof Array) || this.length !== b.length) {
        return false;
    }
    iLen = this.length;
    if (fEqualTo == undefined) {
        for (i = 0; i < iLen; i++) {
            if (this[i] !== b[i]) {
                break;
            }
        }
    }
    else {
        for (i = 0; i < iLen; i++) {
            if (fEqualTo(this[i], b[i])) {
                break;
            }
        }
    }
    if (i === iLen) {
        return true;
    }
    return false;
};
Array.prototype.includes = function (obj, fEqualTo) {
    //含まれている場合は配列内のそのオブジェクトを返す
    //fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
    if (fEqualTo == undefined) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] == obj) {
                return this[i];
            }
        }
    }
    else {
        for (var i = 0, len = this.length; i < len; i++) {
            if (fEqualTo(this[i], obj)) {
                return this[i];
            }
        }
    }
    return false;
};
Array.prototype.getIndex = function (obj, fEqualTo) {
    // 含まれている場合は配列内におけるそのオブジェクトの添字を返す。
    // 見つからなかった場合、-1を返す。
    //fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
    if (fEqualTo == undefined) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
    }
    else {
        for (var i = 0, len = this.length; i < len; i++) {
            if (fEqualTo(this[i], obj)) {
                return i;
            }
        }
    }
    return -1;
};
Array.prototype.getAllMatched = function (obj, fEqualTo) {
    // 評価関数が真となる要素をすべて含んだ配列を返す。
    // 返すべき要素がない場合は空配列を返す。
    // fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
    var retArray = new Array();
    if (fEqualTo == undefined) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] == obj) {
                retArray.push(this[i]);
            }
        }
    }
    else {
        for (var i = 0, len = this.length; i < len; i++) {
            if (fEqualTo(this[i], obj)) {
                retArray.push(this[i]);
            }
        }
    }
    return retArray;
};
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
Array.prototype.pushUnique = function (obj, fEqualTo) {
    //値が既に存在する場合は追加しない。評価関数fEqualTo(array[i], obj)を設定することができる。
    //結果的に配列内にあるオブジェクトが返される。
    var o = this.includes(obj, fEqualTo);
    if (!o) {
        this.push(obj);
        return obj;
    }
    return o;
};
Array.prototype.stableSort = function (f) {
    // http://blog.livedoor.jp/netomemo/archives/24688861.html
    // Chrome等ではソートが必ずしも安定ではないので、この関数を利用する。
    if (f == undefined) {
        f = function (a, b) { return a - b; };
    }
    for (var i = 0; i < this.length; i++) {
        this[i].__id__ = i;
    }
    this.sort.call(this, function (a, b) {
        var ret = f(a, b);
        if (ret == 0) {
            return (a.__id__ > b.__id__) ? 1 : -1;
        }
        else {
            return ret;
        }
    });
    for (var i = 0; i < this.length; i++) {
        delete this[i].__id__;
    }
};
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
Array.prototype.propertiesNamed = function (pName) {
    //Array内の各要素のプロパティpNameのリストを返す。
    var retArray = new Array();
    for (var i = 0, iLen = this.length; i < iLen; i++) {
        retArray.push(this[i][pName]);
    }
    return retArray;
};
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
Array.prototype.copy = function () {
    return (new Array()).concat(this);
};
//文字列関連
String.prototype.replaceAll = function (org, dest) {
    //String中にある文字列orgを文字列destにすべて置換する。
    //http://www.syboos.jp/webjs/doc/string-replace-and-replaceall.html
    return this.split(org).join(dest);
};
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
String.prototype.splitByArraySeparatorSeparatedLong = function (separatorList) {
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
    for (var i = 0; i < separatorList.length; i++) {
        var tmpArray = new Array();
        var tmpCheckArray = new Array();
        for (var k = 0; k < retArray.length; k++) {
            if (!checkArray[k]) {
                var tmpArraySub = retArray[k].split(separatorList[i]);
                tmpArray[k] = new Array();
                tmpCheckArray[k] = new Array();
                for (var m = 0, mLen = tmpArraySub.length - 1; m < mLen; m++) {
                    if (tmpArraySub[m] != "") {
                        tmpArray[k].push(tmpArraySub[m]);
                        tmpCheckArray[k].push(false);
                    }
                    tmpArray[k].push(separatorList[i]);
                    tmpCheckArray[k].push(true);
                }
                if (tmpArraySub[tmpArraySub.length - 1] != "") {
                    tmpArray[k].push(tmpArraySub[m]);
                    tmpCheckArray[k].push(false);
                }
            }
            else {
                tmpArray.push([retArray[k]]);
                tmpCheckArray.push([true]);
            }
        }
        retArray = new Array();
        checkArray = new Array();
        retArray = retArray.concat.apply(retArray, tmpArray);
        checkArray = checkArray.concat.apply(checkArray, tmpCheckArray);
    }
    if (retArray.length == 0) {
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
        //文字列が空であるとき、split メソッドは、空の配列ではなく、1 つの空文字列を含む配列を返します。
        retArray.push("");
    }
    return retArray;
};
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
String.prototype.escapeForHTML = function () {
    var e = document.createElement('div');
    e.appendChild(document.createTextNode(this));
    return e.innerHTML;
};
// http://stackoverflow.com/questions/641857/javascript-window-resize-event
// addEvent(window, "resize", function_reference);
var addEvent = function (elem, type, eventHandle) {
    if (elem == null || typeof (elem) == 'undefined')
        return;
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    }
    else if (elem.attachEvent) {
        elem.attachEvent("on" + type, eventHandle);
    }
    else {
        elem["on" + type] = eventHandle;
    }
};
CanvasRenderingContext2D.prototype.MGC_drawCircle = function (x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI);
    this.closePath();
    this.fill();
    this.stroke();
};
CanvasRenderingContext2D.prototype.MGC_drawLine = function (p, q) {
    this.beginPath();
    this.moveTo(p.x, p.y);
    this.lineTo(q.x, q.y);
    this.closePath();
    this.stroke();
};
CanvasRenderingContext2D.prototype.MGC_drawArrowLine = function (p, q, headSize) {
    // pからqに向かう矢印つき線分を描く
    var b, d;
    headSize = headSize ? headSize : 16;
    this.MGC_drawLine(p, q);
    b = q.getVectorTo(p);
    b = b.getAdjustedVector(headSize);
    d = b.getRotatedVector(Math.PI / 6);
    this.MGC_drawLine(q, q.getCompositeVector(d));
    d = b.getRotatedVector(-Math.PI / 6);
    this.MGC_drawLine(q, q.getCompositeVector(d));
};
CanvasRenderingContext2D.prototype.MGC_drawText = function (text, x, y) {
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
var CallbackEventID;
(function (CallbackEventID) {
    CallbackEventID[CallbackEventID["NodeSelectionChanged"] = 1] = "NodeSelectionChanged";
    CallbackEventID[CallbackEventID["EdgeSelectionChanged"] = 2] = "EdgeSelectionChanged";
})(CallbackEventID || (CallbackEventID = {}));
var MGCanvas = (function () {
    /*
        function(eventID, [args])
        NodeSelectionChanged			function(1, [newNodeInstance, nodeSelectionList]){};
        EdgeSelectionChanged			function(2, [newEdgeInstance, edgeSelectionList]){};
    */
    //
    function MGCanvas(db, canvasDOMObj, GUIControlEnabled) {
        this.tickPerSecond = 30;
        this.tickCount = 0;
        this.isPaused = false;
        this.isEnabledAutomaticTracking = false;
        this.isMouseDown = false;
        this.isClick = false;
        this.mouseDownPosition = new Vector2D(0, 0);
        this.lastMousePosition = new Vector2D(0, 0);
        this.grabbedNode = null;
        this.needsRefreshObjectData = false;
        this.nodeSelectionList = new Array();
        this.edgeSelectionList = new Array();
        this.eventHandler = null;
        this.currentScale = 1;
        this.regulationList = new Array();
        //
        this.globalRegulation = {
            nodeRepulsionWithEdge: function (env) {
                // 自分を端点に含まないEdgeとの距離が近い場合、そのエッジから遠ざかろうとする。
                var p, nl, nlLen, i; // aNode
                var q, el, elLen, k; // anEdge
                var l, e, lt;
                var ec;
                //
                nl = env.db.atomList;
                el = env.db.relationList;
                nlLen = nl.length;
                elLen = el.length;
                //
                for (i = 0; i < nlLen; i++) {
                    p = nl[i];
                    lt = p.size * 8;
                    for (k = 0; k < elLen; k++) {
                        q = el[k];
                        ec = q.elementCache;
                        if (ec.length == 2 && ec[0]) {
                            if (ec[0] && ec[1] && ec[0] != p && ec[1] != p) {
                                l = p.position.getDistanceFromPoitToLine(ec[0].position, ec[1].position);
                                if (l < lt && l != 0) {
                                    if (l < 1) {
                                        // あまりに近すぎると反発力が強くなりすぎるので調整
                                        l = 1;
                                    }
                                    if (p.velocity.getVectorLength() > 5) {
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
            }
        };
        var that = this;
        var f;
        //
        this.initGraphicContext(canvasDOMObj);
        //
        this.tickTimer = window.setInterval(function () { that.tick(); }, 1000 / this.tickPerSecond);
        //
        this.db = (db instanceof MGDatabase) ? db : new MGDatabase();
        this.db.eventHandler_attemptToAddAtom = function (e, db) {
            return that.attemptToAddAtom(e, db);
        };
        this.db.eventHandler_attemptToAddRelation = function (e, db) {
            return that.attemptToAddRelation(e, db);
        };
        //
        if (GUIControlEnabled) {
            //
            // Mouse
            //
            /* down */
            f = function (e) {
                var node;
                var pGraph;
                if (e.button === 0) {
                    // left button
                    that.lastMousePosition = that.getPointerPositionOnElement(e);
                    that.mouseDownPosition = that.lastMousePosition;
                    that.isMouseDown = true;
                    that.isClick = true;
                    that.isEnabledAutomaticTracking = false;
                    //e.preventDefault();
                    pGraph = that.convertPointToGraphLayerFromCanvasLayerP(that.lastMousePosition);
                    node = that.getNodeAtPoint(pGraph);
                    if (node) {
                        that.grabbedNode = node;
                    }
                }
            };
            this.canvas.addEventListener("mousedown", f, false);
            if (window.TouchEvent && window.addEventListener) {
                this.canvas.addEventListener("touchstart", f, false);
            }
            /* right down default prevent */
            f = function (e) {
                var p = that.getPointerPositionOnElement(e);
                var pGraph = that.convertPointToGraphLayerFromCanvasLayerP(p);
                var node = that.getNodeAtPoint(pGraph);
                if (node) {
                    e.preventDefault();
                    //
                    if (node.openContextMenu) {
                        node.openContextMenu();
                    }
                }
            };
            this.canvas.addEventListener("contextmenu", f, false);
            /* move */
            f = function (e) {
                var currentMousePosition;
                if (that.isMouseDown) {
                    currentMousePosition = that.getPointerPositionOnElement(e);
                    if (!that.grabbedNode) {
                        // View moving with mouse
                        that.moveViewRelative((that.lastMousePosition.x - currentMousePosition.x) / that.currentScale, (that.lastMousePosition.y - currentMousePosition.y) / that.currentScale);
                    }
                    that.lastMousePosition = currentMousePosition;
                }
                that.isClick = false;
                e.preventDefault();
            };
            this.canvas.addEventListener("mousemove", f, false);
            if (window.TouchEvent && window.addEventListener) {
                this.canvas.addEventListener("touchmove", f, false);
            }
            /* up */
            f = function (e) {
                that.isMouseDown = false;
                that.grabbedNode = null;
                if (that.isClick) {
                    var p = that.convertPointToGraphLayerFromCanvasLayerP(that.lastMousePosition);
                    var node = that.getNodeAtPoint(p);
                    that.selectNode(node, e.shiftKey);
                    var edge = that.getEdgeAtPoint(p);
                    that.selectEdge(edge, e.shiftKey);
                    that.isClick = false;
                }
            };
            this.canvas.addEventListener("mouseup", f, false);
            if (window.TouchEvent && window.addEventListener) {
                this.canvas.addEventListener("touchend", f, false);
            }
        }
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
    MGCanvas.prototype.attemptToAddAtom = function (e, db) {
        var ne = new MGNode();
        ne.copyFrom(e);
        ne.env = this;
        return ne;
    };
    MGCanvas.prototype.attemptToAddRelation = function (e, db) {
        var ne = new MGEdge();
        ne.copyFrom(e);
        ne.env = this;
        return ne;
    };
    //
    // add / update / remove
    //
    /*
    updateNode(node, contents){
        if(!(node instanceof MGNode)){
            console.log("Invalid node.");
            return;
        }
        node.contents = contents;
        this.needsRefreshObjectData = true;
    }
    */
    /*
    removeNode(node){
        if(node instanceof MGNode){
            this.selectSub_setSelectionState(node, false, this.nodeSelectionList, this.eventHandeler);
            this.nodeList.removeAnObject(node);
            node.env = null;
            if(node.detach){
                node.detach(this);
            }
            //
            var a = this.getListOfEdgeConnectedWithNodeID(node.nodeid);
            for(var i = 0; i < a.length; i++){
                a[i][0].updateConnection(a[i][0].nodeid0, a[i][0].nodeid1);
            }
            //
            this.needsRefreshObjectData = true;
        } else{
            console.log("Invalid node.")
        }
    }
    */
    /*
    updateEdge(edge: MGEdge, nodeid0, nodeid1, edgetypeid){
        edge.updateAttribute(nodeid0, nodeid1, edgetypeid);
    }
    */
    /*
    removeEdge(edge){
        if(edge instanceof MGEdge){
            this.selectSub_setSelectionState(edge, false, this.edgeSelectionList, this.eventHandeler);
            this.edgeList.removeAnObject(edge);
            edge.env = null;
            if(edge.detach){
                edge.detach(this);
            }
            this.needsRefreshObjectData = true;
        } else{
            console.log("Invalid edge.")
        }
    }
    */
    MGCanvas.prototype.addRegulation = function (f) {
        if (f instanceof Function) {
            this.regulationList.push(f);
        }
        else {
            console.log("Invalid regulation.");
        }
    };
    //
    // search / get
    //
    /*
    getNodeByID(nodeid){
        if(nodeid == UUID.nullUUID){
            return false;
        }
        return this.nodeList.includes(nodeid, function(aobj, nid){
            return (aobj.nodeid === nid);
        });
    }
    getNodeByContents(nodecontents){
        return this.nodeList.includes(nodecontents, function(aobj, nc){
            return (aobj.contents === nc);
        });
    }
    getEdgeByID(edgeid){
        if(edgeid == UUID.nullUUID){
            return false;
        }
        return this.edgeList.includes(edgeid, function(aobj, eid){
            return (aobj.edgeid === eid);
        });
    }
    */
    /*
    getListOfEdgeConnectedWithNodeID(nodeid: string){
        // [[edge, theOtherNode], ...]
        var a;
        var retv: Array<>;
        if(nodeid == UUID.nullUUID){
            return new Array();
        }
        retv = new Array();
        a = this.edgeList.getAllMatched(nodeid, function(aobj: MGEdge, nid: string){
            return (aobj.nodeid0 === nid || aobj.nodeid1 === nid);
        });
        for(var i = 0; i < a.length; i++){
            if(a[i].nodeid0 === nodeid){
                retv.push([a[i], a[i].node1])
            } else{
                retv.push([a[i], a[i].node0])
            }
        }
        return retv;
    }
    */
    //
    // Other functions
    //
    MGCanvas.prototype.bringToCenter = function () {
        // 重心を求めて、それを表示オフセットに設定する
        var g = new Vector2D(0, 0);
        var p;
        p = this.db.atomList;
        for (var i = 0, iLen = p.length; i < iLen; i++) {
            g.x += p[i].position.x;
            g.y += p[i].position.y;
        }
        g.x /= p.length;
        g.y /= p.length;
        this.positionOffset.x = -g.x;
        this.positionOffset.y = -g.y;
        this.isEnabledAutomaticTracking = true;
    };
    MGCanvas.prototype.zoomIn = function () {
        this.context.scale(2, 2);
        this.currentScale *= 2;
    };
    MGCanvas.prototype.zoomOut = function () {
        this.context.scale(0.5, 0.5);
        this.currentScale *= 0.5;
    };
    MGCanvas.prototype.moveViewAbsolute = function (x, y) {
        // change center point of view to (x, y).
        // in canvas coordinate (not view coordinate).
        this.positionOffset.x = -x;
        this.positionOffset.y = -y;
    };
    MGCanvas.prototype.moveViewRelative = function (x, y) {
        this.positionOffset.x += -x;
        this.positionOffset.y += -y;
    };
    MGCanvas.prototype.bringInScreen = function () {
        //大きく外れていないときには動かさない
        var g = new Vector2D(0, 0);
        var f = new Vector2D(0, 0);
        var p;
        var i, iLen;
        //
        p = this.db.atomList;
        for (i = 0, iLen = p.length; i < iLen; i++) {
            g.x += p[i].position.x;
            g.y += p[i].position.y;
        }
        g.x /= p.length;
        g.y /= p.length;
        g.x += this.positionOffset.x;
        g.y += this.positionOffset.y;
        if (g.x < this.displayRect.origin.x / 2 ||
            g.x > -this.displayRect.origin.x / 2 ||
            g.y < this.displayRect.origin.y / 2 ||
            g.y > -this.displayRect.origin.x / 2) {
            this.positionOffset.x += -g.x;
            this.positionOffset.y += -g.y;
        }
    };
    MGCanvas.prototype.tick = function () {
        var p;
        var i, iLen;
        var dr;
        this.tickCount++;
        //
        // AutomaticTracking
        //
        if (this.isEnabledAutomaticTracking && (this.tickCount % 30 == 0)) {
            this.bringInScreen();
        }
        //
        // grabbedNode
        //
        if (this.grabbedNode) {
            p = this.convertPointToGraphLayerFromCanvasLayerP(this.lastMousePosition);
            this.grabbedNode.position.x = p.x;
            this.grabbedNode.position.y = p.y;
        }
        //
        // Node and Edge 
        //
        if (!this.isPaused) {
            //
            // Move & Compute
            //
            p = this.db.elementList;
            for (i = 0, iLen = p.length; i < iLen; i++) {
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
        for (i = 0, iLen = p.length; i < iLen; i++) {
            p[i].draw();
        }
        //
        this.context.translate(-this.positionOffset.x, -this.positionOffset.y);
    };
    MGCanvas.prototype.getPointerPositionOnElement = function (e) {
        // http://tmlife.net/programming/javascript/javascript-mouse-pos.html
        // retv:
        var retv = new Vector2D();
        var rect;
        var p;
        if (!e) {
            //for IE
            e = window.event;
        }
        if (e.changedTouches) {
            p = e.changedTouches[0];
        }
        else {
            p = e;
        }
        rect = e.target.getBoundingClientRect();
        retv.x = p.clientX - rect.left;
        retv.y = p.clientY - rect.top;
        return retv;
    };
    MGCanvas.prototype.initGraphicContext = function (newCanvas) {
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
    };
    MGCanvas.prototype.convertPointToGraphLayerFromCanvasLayerP = function (pCanvas) {
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
    };
    MGCanvas.prototype.convertPointToCanvasLayerFromGraphLayerP = function (pGraph) {
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
    };
    MGCanvas.prototype.getNodeAtPoint = function (p) {
        var nl = this.db.atomList;
        for (var i = 0, iLen = nl.length; i < iLen; i++) {
            var k = nl[i].size;
            var r = new Rectangle2D(nl[i].position.x - k, nl[i].position.y - k, 2 * k, 2 * k);
            if (r.includesPoint(p)) {
                return nl[i];
            }
        }
        return null;
    };
    MGCanvas.prototype.getEdgeAtPoint = function (p) {
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
    };
    MGCanvas.prototype.selectNode = function (node, isMultiSelection) {
        this.selectSub(node, isMultiSelection, this.nodeSelectionList, CallbackEventID.NodeSelectionChanged);
    };
    MGCanvas.prototype.selectEdge = function (edge, isMultiSelection) {
        this.selectSub(edge, isMultiSelection, this.edgeSelectionList, CallbackEventID.EdgeSelectionChanged);
    };
    MGCanvas.prototype.selectSub = function (obj, isMultiSelection, list, callbackEventID) {
        if (!isMultiSelection) {
            for (var i = 0, iLen = list.length; i < iLen; i++) {
                this.selectSub_setSelectionState(list[0], false, list, callbackEventID);
            }
        }
        this.selectSub_setSelectionState(obj, !list.includes(obj), list, callbackEventID);
    };
    MGCanvas.prototype.selectSub_setSelectionState = function (obj, state, list, callbackEventID) {
        if (!obj) {
            return;
        }
        var t = list.includes(obj);
        if (t == state) {
            return;
        }
        else {
            if (state) {
                list.push(obj);
                obj.isSelected = true;
            }
            else {
                list.removeAnObject(obj);
                obj.isSelected = false;
            }
            if (this.eventHandler) {
                this.eventHandler(callbackEventID, [obj, list]);
            }
        }
    };
    MGCanvas.prototype.resizeTo = function (w, h) {
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
    };
    return MGCanvas;
})();
var MGDatabase = (function () {
    //
    function MGDatabase() {
        this.saveDataPrefix = "mgdbdata";
        this.elementList = new Array();
        this.atomList = new Array();
        this.relationList = new Array();
    }
    //
    // Add
    //
    MGDatabase.prototype.addAtom = function (contents) {
        // retv: elementID
        var e;
        e = new MGDatabaseAtomElement(contents);
        return this.addElement(e);
    };
    MGDatabase.prototype.addRelation = function (typeID, elementIDList) {
        // retv: elementID
        var e;
        e = new MGDatabaseRelationElement(typeID, elementIDList);
        return this.addElement(e);
    };
    MGDatabase.prototype.addElement = function (e) {
        // retv: elementID
        if (e instanceof MGDatabaseAtomElement) {
            if (this.eventHandler_attemptToAddAtom) {
                e = this.eventHandler_attemptToAddAtom(e, this);
            }
        }
        else if (e instanceof MGDatabaseRelationElement) {
            if (this.eventHandler_attemptToAddRelation) {
                e = this.eventHandler_attemptToAddRelation(e, this);
            }
        }
        if (!(e instanceof MGDatabaseAtomElement || e instanceof MGDatabaseRelationElement)) {
            console.log("addElement: e is not a MGDatabaseElement.");
            return null;
        }
        if (!UUID.verifyUUID(e.elementID)) {
            e.elementID = UUID.generateVersion4();
        }
        if (this.elementList.includes(e.elementID, this.fEqualTo_elementList_elementID)) {
            console.log("addElement: elementID already exists.");
            return null;
        }
        if (e instanceof MGDatabaseAtomElement) {
            this.atomList.push(e);
            if (this.eventHandler_atomAdded) {
                this.eventHandler_atomAdded(e, this);
            }
        }
        else if (e instanceof MGDatabaseRelationElement) {
            this.relationList.push(e);
            if (this.eventHandler_relationAdded) {
                this.eventHandler_relationAdded(e, this);
            }
        }
        else {
            console.log("addElement: e is an unknown MGDatabaseElement.");
            return null;
        }
        this.elementList.push(e);
        //console.log("Element added.");
        //console.log(e.getStringRepresentation());
        // console.log(mgdb);
        return e.elementID;
    };
    MGDatabase.prototype.addElementFromStringRepresentation = function (str) {
        var t;
        if (str.length <= 32 + 4 + 1) {
            // UUIDより短い場合は明らかにデータではないので読み込まない
            return;
        }
        if (str.charAt(0) === "#") {
            // Node
            t = new MGDatabaseAtomElement();
        }
        else if (str.charAt(0) === "$") {
            // Edge
            t = new MGDatabaseRelationElement();
        }
        if (t) {
            t.loadStringRepresentation(str);
            this.addElement(t);
        }
    };
    //
    // Search / Get
    //
    MGDatabase.prototype.getElementByID = function (eid) {
        // retv: element instance or false
        if (eid == UUID.nullUUID) {
            return false;
        }
        return this.elementList.includes(eid, this.fEqualTo_elementList_elementID);
    };
    MGDatabase.prototype.getElementByContents = function (contents) {
        // retv: element instance or false
        return this.elementList.includes(contents, this.fEqualTo_elementList_contents);
    };
    MGDatabase.prototype.getListOfRelationConnectedWithElementID = function (eid) {
        var retv;
        if (eid == UUID.nullUUID) {
            return new Array();
        }
        //
        retv = this.relationList.getAllMatched(eid, function (r) {
            return r.elementIDList.includes(eid);
        });
        return retv;
    };
    //
    // fEqualTo
    //
    MGDatabase.prototype.fEqualTo_elementList_elementID = function (anElement, elementID) {
        return (anElement.elementID === elementID);
    };
    MGDatabase.prototype.fEqualTo_elementList_contents = function (anElement, contents) {
        return (anElement.contents === contents);
    };
    //
    // Load / Save
    //
    MGDatabase.prototype.loadDBDataFromLocalStorage = function (savename) {
        var key = this.saveDataPrefix;
        if (savename && savename.length > 0) {
            key += "_" + savename.trim();
        }
        this.loadDBDataStr(localStorage.getItem(key));
    };
    MGDatabase.prototype.saveDBDataToLocalStorage = function (savename) {
        var dbstr = this.createDBDataStr();
        var key = this.saveDataPrefix;
        if (savename && savename.length > 0) {
            key += "_" + savename.trim();
        }
        localStorage.setItem(key, dbstr);
    };
    MGDatabase.prototype.createDBDataStr = function () {
        var str = "";
        for (var i = 0, iLen = this.elementList.length; i < iLen; i++) {
            str += this.elementList[i].getStringRepresentation();
        }
        return str;
    };
    MGDatabase.prototype.getURLForDBDataStr = function () {
        var str = this.createDBDataStr();
        //
        var d = new Blob([str]);
        if (d) {
            d = this.createURLForBlob(d);
            return d;
        }
        return null;
    };
    MGDatabase.prototype.loadDBDataStr = function (datastr) {
        if (!datastr) {
            console.log("[loadDBString] Invalid DBString.\n");
            return false;
        }
        this.resetDB();
        //
        var list = datastr.split("\n");
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            this.addElementFromStringRepresentation(list[i]);
        }
        return true;
    };
    MGDatabase.prototype.createURLForBlob = function (blobData) {
        //http://www.atmarkit.co.jp/ait/articles/1112/16/news135_2.html
        //http://qiita.com/mohayonao/items/fa7d33b75a2852d966fc
        if (window.URL) {
            return window.URL.createObjectURL(blobData);
        }
        else if (window.webkitURL) {
            return window.webkitURL.createObjectURL(blobData);
        }
        return null;
    };
    //
    // Reset
    //
    MGDatabase.prototype.resetDB = function () {
        this.elementList = new Array();
        this.atomList = new Array();
        this.relationList = new Array();
    };
    return MGDatabase;
})();
var MGDatabaseAtomElement = (function () {
    //
    function MGDatabaseAtomElement(contents) {
        this.contents = contents;
    }
    MGDatabaseAtomElement.prototype.loadStringRepresentation = function (str) {
        // retv: elementID
        if (str[0] !== "#") {
            console.log("loadStringRepresentation: str is not valid.");
            return null;
        }
        this.elementID = UUID.verifyUUID(str.substr(1, 32 + 4));
        //
        this.contents = decodeURIComponent(str.substring(str.lastIndexOf(" ") + 1).trim());
        return this.elementID;
    };
    MGDatabaseAtomElement.prototype.getStringRepresentation = function () {
        // 末尾には改行文字が自動で付加されます。
        var str = "";
        str += "#";
        str += this.elementID;
        str += " ";
        str += encodeURIComponent(this.contents);
        str += "\n";
        return str;
    };
    MGDatabaseAtomElement.prototype.copyFrom = function (e) {
        this.elementID = e.elementID;
        this.contents = e.contents;
    };
    return MGDatabaseAtomElement;
})();
var MGDatabaseRelationElement = (function () {
    //
    function MGDatabaseRelationElement(typeID, eIDList) {
        this.typeElementID = UUID.verifyUUID(typeID);
        if (!this.typeElementID) {
            this.typeElementID = UUID.nullUUID;
        }
        this.elementIDList = new Array();
        if (eIDList instanceof Array) {
            for (var i = 0; i < eIDList.length; i++) {
                this.elementIDList[i] = UUID.verifyUUID(eIDList[i]);
                if (!this.elementIDList[i]) {
                    this.elementIDList[i] = UUID.nullUUID;
                }
            }
        }
    }
    //
    MGDatabaseRelationElement.prototype.loadStringRepresentation = function (str) {
        // retv: elementID
        var p;
        if (str[0] !== "$") {
            console.log("loadStringRepresentation: str is not valid.");
            return null;
        }
        this.elementID = UUID.verifyUUID(str.substr(1, 32 + 4));
        p = 32 + 4;
        //
        p = str.indexOf("#", p) + 1;
        if (p == 0) {
            console.log("loadStringRepresentation: str is not valid.");
            return null;
        }
        this.typeElementID = UUID.verifyUUID(str.substr(p, 32 + 4));
        //
        this.elementIDList = new Array();
        for (var i = 0;; i++) {
            p = str.indexOf("#", p) + 1;
            if (p == 0) {
                break;
            }
            this.elementIDList[i] = UUID.verifyUUID(str.substr(p, 32 + 4));
        }
        return this.elementID;
    };
    MGDatabaseRelationElement.prototype.getStringRepresentation = function () {
        // 末尾には改行文字が自動で付加されます。
        var str = "";
        //
        str += "$";
        str += this.elementID;
        //
        str += " #";
        str += this.typeElementID;
        for (var i = 0; i < this.elementIDList.length; i++) {
            str += " #";
            str += this.elementIDList[i];
        }
        str += "\n";
        return str;
    };
    MGDatabaseRelationElement.prototype.copyFrom = function (e) {
        this.elementID = e.elementID;
        this.typeElementID = e.typeElementID;
        this.elementIDList = e.elementIDList.copy();
    };
    return MGDatabaseRelationElement;
})();
var MGDatabaseQuery = (function () {
    function MGDatabaseQuery(db, domain) {
        this.nextIndex = 0;
        this.hasReachedEnd = false;
        // domainは省略可能で、指定するならばatom, relation, elementsのいずれかである。
        this.list = db.elementList;
        switch (domain) {
            case "atom":
                this.list = db.atomList;
                break;
            case "relation":
                this.list = db.atomList;
                break;
        }
    }
    //
    MGDatabaseQuery.prototype.setCondition = function (conditionalFunc) {
        this.conditionalFunc = conditionalFunc;
        this.nextIndex = 0;
        this.hasReachedEnd = false;
    };
    MGDatabaseQuery.prototype.getNextMatched = function () {
        if (!this.conditionalFunc) {
            return false;
        }
        for (var i = this.nextIndex, iLen = this.list.length; i < iLen; i++) {
            if (this.conditionalFunc(this.list[i])) {
                this.nextIndex = i + 1;
                return this.list[i];
            }
        }
        this.hasReachedEnd = true;
        return false;
    };
    return MGDatabaseQuery;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MGEdge = (function (_super) {
    __extends(MGEdge, _super);
    //
    function MGEdge(typeid, elementIDList) {
        // e[0]に矢印マークがつく。
        // 時計回りにeは配置される。
        _super.call(this, typeid, elementIDList);
        this.StrokeColor_default = "rgba(51, 119, 193, 0.5)";
        this.StrokeColor_selected = "rgba(255, 0, 0, 1)";
        this.FillColor_default = "rgba(255, 255, 255, 0);";
        //
        this.naturalLength = 100;
        this.springRate = 10;
        this.elementCache = new Array();
        this.lineWidth = 2;
        this.isSelected = false;
        this.isAnchor = false;
        this.frictionFactor = 0.005;
        this.size = 8;
        this.needsUpdateEdgeCache = false;
        // Kinetic attributes
        this.position = new Vector2D(Math.random() * 64 - 32, Math.random() * 64 - 32); // [px]
        this.velocity = new Vector2D(0, 0); // [px / tick]
        this.currentForce = new Vector2D(0, 0); // [px / tick^2]
        //
        this.strokeStyle = this.StrokeColor_default;
        this.mass = 10 * 10 * Math.PI;
    }
    //
    MGEdge.prototype.draw = function () {
        var ctx = this.env.context;
        //
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        //ctx.font = this.font;
        if (this.isSelected) {
            this.env.context.strokeStyle = this.StrokeColor_selected;
        }
        else {
            this.env.context.strokeStyle = this.strokeStyle;
            this.env.context.fillStyle = this.FillColor_default;
        }
        this.env.context.lineWidth = this.lineWidth;
        //
        this.drawEdgeLine();
        ctx.strokeRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
        if (this.typeElementCache && this.typeElementCache instanceof MGDatabaseAtomElement) {
            ctx.MGC_drawText(this.typeElementCache.contents, this.position.x, this.position.y);
        }
        // for Debug
        var pTo;
        ctx.strokeStyle = "rgba(255, 183, 19, 0.5)";
        pTo = this.position.getCompositeVector(this.velocity.getVectorScalarMultiplied(100));
        ctx.MGC_drawArrowLine(this.position, pTo);
    };
    MGEdge.prototype.tick = function () {
        this.tick_node();
        this.tick_connection();
    };
    MGEdge.prototype.tick_node = function () {
        var u;
        var l;
        // Update cache
        this.checkAndUpdateCache();
        // Force / Velocity / Position
        if (this.elementCache.length <= 1) {
            this.velocity.x += this.currentForce.x / this.mass;
            this.velocity.y += this.currentForce.y / this.mass;
            this.currentForce.setComponent(0, 0);
        }
        if (!this.isAnchor) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
        // Friction
        l = this.frictionFactor * this.mass;
        if (this.velocity.getVectorLength() > l) {
            u = this.velocity.getUnitVector().getAdjustedVector(-l);
            this.velocity.addVector(u);
        }
        else {
            this.velocity.setComponent(0, 0);
        }
    };
    MGEdge.prototype.tick_connection = function () {
        // el.length >= 2
        var i, iLen;
        var x, y;
        var el = this.elementCache;
        iLen = el.length;
        if (iLen < 2) {
            if (iLen == 1) {
                this.applySpringForce(this.position, el[0]);
                this.applySpringForce(el[0].position, this);
            }
            //this.currentForce.setComponent(0, 0);
            //this.velocity.setComponent(0, 0);
            return;
        }
        //
        this.position = this.getCenterPoint();
        for (i = 0; i < iLen; i++) {
            this.applySpringForce(this.position, el[i]);
        }
        // Force
        x = this.currentForce.x / iLen;
        y = this.currentForce.y / iLen;
        for (i = 0; i < iLen; i++) {
            el[i].currentForce.x += x;
            el[i].currentForce.y += y;
        }
        this.currentForce.setComponent(0, 0);
        //this.velocity.setComponent(0, 0);
    };
    MGEdge.prototype.applySpringForce = function (basePos, targetElement) {
        var cl, cf, u;
        //
        cl = basePos.getVectorTo(targetElement.position).getVectorLength();
        cf = (this.naturalLength - cl) * this.springRate;
        u = targetElement.position.getUnitVectorTo(basePos).getAdjustedVector(-cf);
        if (isNaN(u.x) || isNaN(u.y)) {
            return;
        }
        if (targetElement instanceof MGNode || targetElement instanceof MGEdge) {
            targetElement.currentForce.addVector(u);
        }
    };
    MGEdge.prototype.drawEdgeLine = function () {
        var p;
        var n = this.elementCache;
        var cp = this.position;
        var l;
        var ctx = this.env.context;
        var i, iLen = n.length;
        if (iLen > 2) {
            for (i = 0; i < iLen; i++) {
                l = this.position.getVectorTo(n[i].position);
                l = l.getAdjustedVector(l.getVectorLength() - n[i].size);
                ctx.MGC_drawLine(this.position, this.position.getCompositeVector(l));
                l = l.getAdjustedVector(l.getVectorLength() / 2);
                l = this.position.getCompositeVector(l);
                ctx.MGC_drawText(i.toString(10), l.x, l.y);
            }
        }
        else if (iLen == 2) {
            l = n[1].position.getVectorTo(n[0].position);
            l = l.getAdjustedVector(l.getVectorLength() - n[1].size - n[0].size);
            p = n[1].position.getCompositeVector(l.getAdjustedVector(n[1].size));
            ctx.MGC_drawArrowLine(p, p.getCompositeVector(l));
        }
        else if (iLen == 1) {
            l = this.position.getVectorTo(n[0].position);
            l = l.getAdjustedVector(l.getVectorLength() - n[0].size);
            p = this.position;
            ctx.MGC_drawArrowLine(p, p.getCompositeVector(l));
        }
    };
    MGEdge.prototype.checkAndUpdateCache = function () {
        var i;
        if (!this.typeElementCache || this.typeElementCache.elementID != this.typeElementID) {
            this.typeElementCache = this.env.db.getElementByID(this.typeElementID);
        }
        if (!this.elementCache.isEqualTo(this.elementIDList, this.env.db.fEqualTo_elementList_elementID)) {
            this.updateElementCache();
        }
    };
    MGEdge.prototype.updateElementCache = function () {
        var i, iLen;
        var diff;
        diff = this.elementCache;
        //
        iLen = this.elementIDList.length;
        this.elementCache = new Array();
        for (i = 0; i < iLen; i++) {
            this.elementCache[i] = this.env.db.getElementByID(this.elementIDList[i]);
        }
        //
        diff = diff.symmetricDifferenceWith(this.elementCache);
        iLen = diff.length;
        for (i = 0; i < iLen; i++) {
            diff[i].needsUpdateEdgeCache = true;
        }
    };
    MGEdge.prototype.getCenterPoint = function () {
        var g = new Vector2D();
        var el = this.elementCache;
        var i, iLen = el.length;
        for (i = 0; i < iLen; i++) {
            g.x += el[i].position.x;
            g.y += el[i].position.y;
        }
        g.x /= iLen;
        g.y /= iLen;
        return g;
    };
    return MGEdge;
})(MGDatabaseRelationElement);
// Nodeが保存すべき情報
// this.nodeid
// this.contents
// this.position
// this.velocity
var MGNode = (function (_super) {
    __extends(MGNode, _super);
    //
    function MGNode(contents) {
        _super.call(this, contents);
        this.sizebase = 10;
        this.lineWidth = 2;
        this.strokeStyle = "rgba(0, 0, 0, 0.75)";
        this.font = "16px sans-serif";
        //
        this.FillColor_connected = "rgba(255, 255, 255, 0.5)";
        this.FillColor_noConnection = "rgba(0, 0, 0, 0.5)";
        this.FillColor_selected = "rgba(255, 0, 0, 1)";
        //
        this.size = 10; // radius
        this.frictionFactor = 0.005;
        this.isAnchor = false;
        this.isSelected = false;
        this.edgeCache = new Array();
        this.needsUpdateEdgeCache = false;
        //
        this.contextMenuRect = new Rectangle2D(0, 0, 200, 100);
        this.contextMenuOpened = false;
        // Kinetic attributes
        this.position = new Vector2D(Math.random() * 64 - 32, Math.random() * 64 - 32);
        this.velocity = new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.currentForce = new Vector2D(0, 0);
        //  Cached data (will be changed frequently)
        this.mass = this.size * this.size * Math.PI;
        this.fillStyle = this.FillColor_noConnection;
    }
    //
    MGNode.prototype.draw = function () {
        var ctx = this.env.context;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.font = this.font;
        if (this.isSelected) {
            ctx.strokeStyle = this.FillColor_selected;
        }
        else {
            ctx.strokeStyle = this.strokeStyle;
        }
        //
        ctx.MGC_drawCircle(this.position.x, this.position.y, this.size);
        if (this.contents) {
            ctx.fillStyle = this.FillColor_connected;
            ctx.MGC_drawText(this.contents.toString(), this.position.x + this.size, this.position.y + this.size);
        }
        // for Debug
        var pTo;
        ctx.strokeStyle = "rgba(255, 183, 19, 0.5)";
        pTo = this.position.getCompositeVector(this.velocity.getVectorScalarMultiplied(100));
        ctx.MGC_drawArrowLine(this.position, pTo);
        // context menu
        this.updateContextMenu();
        if (this.contextMenuOpened) {
            this.drawContextMenu();
        }
    };
    MGNode.prototype.tick = function () {
        var u;
        var l;
        if (this.env.grabbedNode === this) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.currentForce.setComponent(0, 0);
            return;
        }
        // Update cache
        if (this.needsUpdateEdgeCache) {
            this.updateEdgeCache();
        }
        // Repulsion with elements.
        this.tick_elementRepulsion();
        // Force / Velocity / Position
        var preF = this.velocity.getVectorLength();
        this.velocity.x += this.currentForce.x / this.mass;
        this.velocity.y += this.currentForce.y / this.mass;
        this.currentForce.setComponent(0, 0);
        if (!this.isAnchor) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
        // Friction
        l = this.frictionFactor * this.mass;
        if (this.velocity.getVectorLength() > l) {
            u = this.velocity.getUnitVector().getAdjustedVector(-l);
            this.velocity.addVector(u);
        }
        else {
            this.velocity.setComponent(0, 0);
        }
        // context menu
        //this.updateContextMenu();
    };
    MGNode.prototype.tick_elementRepulsion = function () {
        // 距離の近いElement同士には斥力が働くとする。
        var q, nl, nlLen;
        var i;
        var l, e, lt;
        nl = this.env.db.elementList;
        nlLen = nl.length;
        for (i = 0; i < nlLen; i++) {
            q = nl[i];
            if (q === this) {
                continue;
            }
            l = this.position.getVectorLengthTo(q.position);
            lt = (this.size + q.size) * 4;
            if (l < lt && l != 0) {
                e = q.position.getVectorTo(this.position);
                e.x *= (lt / l - 1) * 32;
                e.y *= (lt / l - 1) * 32;
                this.currentForce.x += e.x;
                this.currentForce.y += e.y;
                q.currentForce.x -= e.x;
                q.currentForce.y -= e.y;
            }
        }
    };
    MGNode.prototype.updateEdgeCache = function () {
        this.needsUpdateEdgeCache = false;
        this.edgeCache = this.env.db.getListOfRelationConnectedWithElementID(this.elementID);
        this.size = Math.sqrt(this.edgeCache.length) * this.sizebase;
        if (this.size == 0) {
            this.size = this.sizebase;
            this.fillStyle = this.FillColor_noConnection;
        }
        else {
            this.fillStyle = this.FillColor_connected;
        }
        this.mass = this.size * this.size * Math.PI;
    };
    MGNode.prototype.loadFromDBAtomElement = function (e) {
        this.copyFrom(e);
    };
    MGNode.prototype.openContextMenu = function () {
        this.contextMenuOpened = true;
        /*
            var elem: HTMLElement;
            var p: Vector2D;
            var htmlStr: string = "";
            var that = this;
            if(!this.contextMenuDOM){
                this.contextMenuDOM = document.createElement("div");
                this.contextMenuDOM.style.position = "absolute";
                this.contextMenuDOM.style.backgroundColor = "rgba(172, 212, 256, 0.8)";
                this.contextMenuDOM.onmousemove = function(e){ e.preventDefault(); return false; };
                // closeButton
                elem = document.createElement("span");
                elem.setAttribute("aria-hidden", "true");
                elem.setAttribute("class", "glyphicon glyphicon-remove pull-right");
                elem.setAttribute("style", "font-size: 1.5em;");
                elem.onclick = function(){ document.body.removeChild(that.contextMenuDOM); that.contextMenuDOM = null; };
                this.contextMenuDOM.appendChild(elem);
                // body
                elem = document.createElement("div");
                htmlStr += "<h2>Node</h2>";
                htmlStr += "<p>ID: " + this.elementID + "</p>";
                htmlStr += "<p>ID: " + UUID.getBase64EncodedUUID(this.elementID) + "</p>";
                elem.innerHTML = htmlStr;
                this.contextMenuDOM.appendChild(elem);
                //
                document.body.appendChild(this.contextMenuDOM);
                p = this.env.convertPointToCanvasLayerFromGraphLayerP(this.position);
                this.updateContextMenu();
            }
            */
    };
    MGNode.prototype.updateContextMenu = function () {
        var p;
        p = this.env.convertPointToCanvasLayerFromGraphLayerP(this.position);
        //
        this.contextMenuRect.origin.x = this.position.x;
        this.contextMenuRect.origin.y = this.position.y;
    };
    MGNode.prototype.drawContextMenu = function () {
        var ctx = this.env.context;
        var x = this.contextMenuRect.origin.x;
        var y = this.contextMenuRect.origin.y;
        var w = this.contextMenuRect.size.x;
        var h = this.contextMenuRect.size.y;
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.strokeStyle = "rgba(51, 119, 193, 0.5)";
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        //
        ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
        ctx.font = "normal 32px 'Source Code Pro', source-code-pro";
        ctx.MGC_drawText("Node", x + this.size, y + this.size);
    };
    return MGNode;
})(MGDatabaseAtomElement);
var Rectangle2D = (function () {
    function Rectangle2D(x, y, w, h) {
        this.origin = new Vector2D(x, y);
        this.size = new Vector2D(w, h);
    }
    //
    Rectangle2D.prototype.includesPoint = function (p) {
        return (this.origin.x <= p.x) && (p.x <= this.origin.x + this.size.x) &&
            (this.origin.y <= p.y) && (p.y <= this.origin.y + this.size.y);
    };
    return Rectangle2D;
})();
//
// UUID
//
var UUID = (function () {
    function UUID() {
    }
    UUID.verifyUUID = function (uuid) {
        // retv: normalized UUID or false.
        if (!uuid || uuid.length != (32 + 4)) {
            return false;
        }
        return uuid.toLowerCase();
    };
    UUID.convertFromHexString = function (hex) {
        if (hex.length != 32) {
            return false;
        }
        return this.verifyUUID(hex.substr(0, 8) + "-" +
            hex.substr(8, 4) + "-" +
            hex.substr(12, 4) + "-" +
            hex.substr(16, 4) + "-" +
            hex.substr(20, 12));
    };
    UUID.convertFromBase64String = function (b64Str) {
        var hex = "";
        var tmp = 0;
        var i;
        if (b64Str.length === 22) {
            // 末尾の==なしも許容
            b64Str += "==";
        }
        for (i = 0; i < b64Str.length; i++) {
            var c = b64Str.charCodeAt(i);
            tmp <<= 6;
            if (0x41 <= c && c <= 0x5a) {
                // 0x00-0x19
                tmp |= (c - 0x41);
            }
            else if (0x61 <= c && c <= 0x7a) {
                // 0x1a-0x33
                tmp |= (c - 0x61 + 0x1a);
            }
            else if (0x30 <= c && c <= 0x39) {
                // 0x34-0x3d
                tmp |= (c - 0x30 + 0x34);
            }
            else if (c === 0x2b) {
                // 0x3e
                tmp |= 0x3e;
            }
            else if (c === 0x2f) {
                // 0x3f
                tmp |= 0x3f;
            }
            else if (c === 0x3d) {
            }
            else {
                throw "Invalid Base64 String.";
            }
            if ((i & 3) === 3) {
                hex += tmp.toString(16);
                tmp = 0;
            }
        }
        hex = hex.substr(0, 32);
        return UUID.convertFromHexString(hex);
    };
    UUID.generateVersion4 = function () {
        var g = this.generate16bitHexStrFromNumber;
        var f = this.generateRandom16bitHexStr;
        var n = this.generateRandom16bitHex;
        return f() + f() + "-" + f() + "-" + g(0x4000 | (n() & 0x0fff)) + "-" + g(0x8000 | (n() & 0x3fff)) + "-" + f() + f() + f();
    };
    UUID.generateRandom16bitHexStr = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).toLowerCase().substring(1);
    };
    UUID.generateRandom16bitHex = function () {
        return ((Math.random() * 0x10000) | 0);
    };
    UUID.generate16bitHexStrFromNumber = function (num) {
        return (num + 0x10000).toString(16).toLowerCase().substring(1);
    };
    UUID.getBase64EncodedUUID = function (uuid) {
        uuid = this.verifyUUID(uuid);
        if (!uuid) {
            return null;
        }
        uuid = uuid.replaceAll("-", "") + "0000";
        var retv = "";
        var f = function (n) {
            if (0 <= n && n < 26) {
                return String.fromCharCode(0x41 + n);
            }
            else if (26 <= n && n < 52) {
                return String.fromCharCode(0x61 + (n - 26));
            }
            else if (52 <= n && n < 62) {
                return String.fromCharCode(0x30 + (n - 52));
            }
            else if (62 <= n && n < 64) {
                return (n == 62) ? "+" : "/";
            }
        };
        for (var i = 0; i < 6; i++) {
            var chunk = parseInt(uuid.substr(i * 6, 6), 16);
            retv += f(0x3f & (chunk >> 18));
            retv += f(0x3f & (chunk >> 12));
            retv += f(0x3f & (chunk >> 6));
            retv += f(0x3f & chunk);
        }
        retv = retv.substr(0, 22) + "==";
        return retv;
    };
    UUID.nullUUID = "00000000-0000-0000-0000-000000000000";
    return UUID;
})();
//
// Vector2D
//
var Vector2D = (function () {
    //
    function Vector2D(x, y) {
        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
    }
    // Change this element.
    Vector2D.prototype.setComponent = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Vector2D.prototype.addVector = function (p) {
        var v = this.getCompositeVector(p);
        this.setComponent(v.x, v.y);
    };
    // Get scalar value.
    Vector2D.prototype.getVectorLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2D.prototype.getDistanceFromPoitToLine = function (a, b) {
        // この位置ベクトルが示す点と、ベクトルabとの距離を求める。
        // ベクトルabは線分として計算される（直線ではない）。
        // http://www.sousakuba.com/Programming/gs_dot_line_distance.html
        var ab;
        var ap;
        var s;
        var l;
        var d;
        ab = a.getVectorTo(b);
        ap = a.getVectorTo(this);
        s = Math.abs(Vector2D.crossProduct(ab, ap));
        l = ab.getVectorLength();
        d = (s / l);
        s = Vector2D.innerProduct(ap, ab);
        if (s < 0) {
            //線分の範囲外なので端点aからの距離に変換
            //端点から垂線の足までの距離
            l = -(s / l);
            d = Math.sqrt(d * d + l * l);
        }
        else if (s > l * l) {
            //同様に端点bからの距離に変換
            l = s / l;
            d = Math.sqrt(d * d + l * l);
        }
        return d;
    };
    // Get new Vector2D.
    Vector2D.prototype.getVectorCopy = function () {
        return new Vector2D(this.x, this.y);
    };
    Vector2D.prototype.getVectorTo = function (dest) {
        return new Vector2D(dest.x - this.x, dest.y - this.y);
    };
    Vector2D.prototype.getVectorLengthTo = function (dest) {
        return this.getVectorTo(dest).getVectorLength();
    };
    Vector2D.prototype.getUnitVectorTo = function (dest) {
        var e = this.getVectorTo(dest);
        return e.getUnitVector();
    };
    Vector2D.prototype.getUnitVector = function () {
        var l = this.getVectorLength();
        return this.getVectorScalarMultiplied(1 / l);
    };
    Vector2D.prototype.getVectorScalarMultiplied = function (n) {
        var v = this.getVectorCopy();
        v.x *= n;
        v.y *= n;
        return v;
    };
    Vector2D.prototype.getInverseVector = function () {
        return new Vector2D(-this.x, -this.y);
    };
    Vector2D.prototype.getRotatedVector = function (t, s, c) {
        // s, cは省略可能。sin, cosの計算済みの値を渡すことで高速化できる。
        var s = s ? s : Math.sin(t);
        var c = c ? c : Math.cos(t);
        return new Vector2D(this.x * c - this.y * s, this.x * s + this.y * c);
    };
    Vector2D.prototype.getAdjustedVector = function (len) {
        var p = this.getVectorLength();
        if (p == 0 || len == 0) {
            return new Vector2D(0, 0);
        }
        p = len / p;
        return new Vector2D(this.x * p, this.y * p);
    };
    Vector2D.prototype.getCompositeVector = function (p) {
        var v = this.getVectorCopy();
        if (p instanceof Array) {
            var q;
            for (var i = 0, iLen = p.length; i < iLen; i++) {
                q = p[i];
                v.x += q.x;
                v.y += q.y;
            }
        }
        else if (p instanceof Vector2D) {
            v.x += p.x;
            v.y += p.y;
        }
        return v;
    };
    //
    Vector2D.crossProduct = function (a, b) {
        return a.x * b.y - a.y * b.x;
    };
    Vector2D.innerProduct = function (a, b) {
        return a.x * b.x + a.y * b.y;
    };
    Vector2D.getMeanVector = function (vl) {
        var g = new Vector2D();
        var i, iLen = vl.length;
        for (i = 0; i < iLen; i++) {
            g.x += vl[i].x;
            g.y += vl[i].y;
        }
        g.x /= iLen;
        g.y /= iLen;
        return g;
    };
    Vector2D.getNormalUnitVectorSideOfP = function (a, b, p) {
        //直線ab上にない点pが存在する側へ向かう単位法線ベクトルを返す。
        return this.getNormalVectorSideOfP(a, b, p).getUnitVector();
    };
    Vector2D.getNormalVectorSideOfP = function (a, b, p) {
        //直線ab上にない点pが存在する側へ向かう法線ベクトルを返す。
        //pがab上にある場合は零ベクトルとなる。
        var n = a.getVectorTo(b);
        var t = n.x;
        var i;
        n.x = -n.y;
        n.y = t;
        i = Vector2D.innerProduct(n, a.getVectorTo(p));
        if (i < 0) {
            //この法線ベクトルとapの向きが逆なので反転する。
            n.x = -n.x;
            n.y = -n.y;
        }
        else if (i == 0) {
            n.x = 0;
            n.y = 0;
        }
        return n;
    };
    return Vector2D;
})();
var CanvasUIManager = (function () {
    function CanvasUIManager(canvasDOMObj) {
        this.sheetRoot = new Array();
        this.canvas = canvasDOMObj;
        this.context = this.canvas.getContext('2d');
    }
    return CanvasUIManager;
})();
var CanvasUISheet = (function (_super) {
    __extends(CanvasUISheet, _super);
    function CanvasUISheet() {
        _super.apply(this, arguments);
        this.children = new Array();
    }
    return CanvasUISheet;
})(Rectangle2D);