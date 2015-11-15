class MGDatabase
{
	private saveDataPrefix: string = "mgdbdata";
	public elementList: Array<MGDatabaseElement> = new Array();
	public atomList: Array<MGDatabaseAtomElement> = new Array();
	public relationList: Array<MGDatabaseRelationElement> = new Array();
	eventHandler_atomAdded: Function;				// function(e, db);
	eventHandler_relationAdded: Function;			// function(e, db);
	eventHandler_attemptToAddAtom: Function;		// function(e, db); : e
	eventHandler_attemptToAddRelation: Function;	// function(e, db); : e
	//
	constructor()
	{

	}
	//
	// Add
	//
	addAtom(contents: string)
	{
		// retv: elementID
		var e: MGDatabaseAtomElement;
		e = new MGDatabaseAtomElement(contents);
		return this.addElement(e);
	}
	addRelation(typeID: string, elementIDList: Array<string>)
	{
		// retv: elementID
		var e: MGDatabaseRelationElement;
		e = new MGDatabaseRelationElement(typeID, elementIDList);
		return this.addElement(e);
	}
	addElement(e: MGDatabaseElement)
	{
		// retv: elementID
		if(e instanceof MGDatabaseAtomElement){
			if(this.eventHandler_attemptToAddAtom){
				e = this.eventHandler_attemptToAddAtom(e, this);
			}
		} else if(e instanceof MGDatabaseRelationElement){
			if(this.eventHandler_attemptToAddRelation){
				e = this.eventHandler_attemptToAddRelation(e, this);
			}
		}
		if(!(e instanceof MGDatabaseAtomElement || e instanceof MGDatabaseRelationElement)){
			console.log("addElement: e is not a MGDatabaseElement.");
			return null;
		}
		if(!UUID.verifyUUID(e.elementID)){
			e.elementID = UUID.generateVersion4();
		}
		if(this.elementList.includes(e.elementID, this.fEqualTo_elementList_elementID)){
			console.log("addElement: elementID already exists.");
			return null;
		}

		if(e instanceof MGDatabaseAtomElement){
			this.atomList.push(e);
			if(this.eventHandler_atomAdded){
				this.eventHandler_atomAdded(e, this);
			}
		} else if(e instanceof MGDatabaseRelationElement){
			this.relationList.push(e);
			if(this.eventHandler_relationAdded){
				this.eventHandler_relationAdded(e, this);
			}
		} else{
			console.log("addElement: e is an unknown MGDatabaseElement.");
			return null;
		}
		this.elementList.push(e);

		//console.log("Element added.");
		//console.log(e.getStringRepresentation());
		// console.log(mgdb);

		return e.elementID;
	}
	addElementFromStringRepresentation(str: string)
	{
		var t: MGDatabaseElement;
		if(str.length <= 32 + 4 + 1){
			// UUIDより短い場合は明らかにデータではないので読み込まない
			return;
		}
		if(str.charAt(0) === "#"){
			// Node
			t = new MGDatabaseAtomElement();
		} else if(str.charAt(0) === "$"){
			// Edge
			t = new MGDatabaseRelationElement();
		}
		if(t){
			t.loadStringRepresentation(str);
			this.addElement(t);
		}
	}
	//
	// Search / Get
	//
	getElementByID(eid: string)
	{
		// retv: element instance or false
		if(eid == UUID.nullUUID){
			return false;
		}
		return this.elementList.includes(eid, this.fEqualTo_elementList_elementID);
	}
	getElementByContents(contents: string)
	{
		// retv: element instance or false
		return this.elementList.includes(contents, this.fEqualTo_elementList_contents);
	}
	getListOfRelationConnectedWithElementID(eid: string)
	{
		var retv: Array<MGDatabaseRelationElement>;
		if(eid == UUID.nullUUID){
			return new Array();
		}
		//
		retv = this.relationList.getAllMatched(eid, function(r){
			return r.elementIDList.includes(eid);
		});
		return retv;
	}
	//
	// fEqualTo
	//
	fEqualTo_elementList_elementID(anElement: MGDatabaseElement, elementID: string)
	{
		return (anElement.elementID === elementID);
	}
	fEqualTo_elementList_contents(anElement: MGDatabaseAtomElement, contents: string)
	{
		return (anElement.contents === contents);
	}
	//
	// Load / Save
	//
	loadDBDataFromLocalStorage(savename: string)
	{
		var key = this.saveDataPrefix;
		if(savename && savename.length > 0){
			key += "_" + savename.trim();
		}
		this.loadDBDataStr(localStorage.getItem(key));
	}
	saveDBDataToLocalStorage(savename: string)
	{
		var dbstr = this.createDBDataStr();
		var key = this.saveDataPrefix;
		if(savename && savename.length > 0){
			key += "_" + savename.trim();
		}
		localStorage.setItem(key, dbstr);
	}
	createDBDataStr()
	{
		var str = "";
		for(var i = 0, iLen = this.elementList.length; i < iLen; i++){
			str += this.elementList[i].getStringRepresentation();
		}
		return str;
	}
	getURLForDBDataStr()
	{
		var str = this.createDBDataStr();
		//
		var d = new Blob([str]);
		if(d){
			d = this.createURLForBlob(d)
			return d;
		}
		return null;
	}
	loadDBDataStr(datastr: string)
	{
		if(!datastr){
			console.log("[loadDBString] Invalid DBString.\n");
			return false;
		}
		this.resetDB();
		//
		var list = datastr.split("\n");
		for(var i = 0, iLen = list.length; i < iLen; i++){
			this.addElementFromStringRepresentation(list[i]);
		}
		return true;
	}
	createURLForBlob(blobData: Blob)
	{
		//http://www.atmarkit.co.jp/ait/articles/1112/16/news135_2.html
		//http://qiita.com/mohayonao/items/fa7d33b75a2852d966fc
		if(window.URL){
			return window.URL.createObjectURL(blobData);
		} else if(window.webkitURL){
			return window.webkitURL.createObjectURL(blobData);
		}
		return null;
	}
	//
	// Reset
	//
	resetDB()
	{
		this.elementList = new Array();
		this.atomList = new Array();
		this.relationList = new Array();
	}
}

interface MGDatabaseElement
{
	elementID: string;
	//
	loadStringRepresentation(str: string): string;
	getStringRepresentation(): string;
	copyFrom(e: MGDatabaseElement): void;
}

class MGDatabaseAtomElement implements MGDatabaseElement
{
	public elementID: string;
	public contents: string;
	//
	constructor(contents?: string)
	{
		this.contents = contents;
	}
	loadStringRepresentation(str: string): string
	{
		// retv: elementID
		if(str[0] !== "#"){
			console.log("loadStringRepresentation: str is not valid.");
			return null;
		}
		this.elementID = UUID.verifyUUID(str.substr(1, 32 + 4));
		//
		this.contents = decodeURIComponent(str.substring(str.lastIndexOf(" ") + 1).trim());
		return this.elementID;
	}
	getStringRepresentation(): string
	{
		// 末尾には改行文字が自動で付加されます。
		var str = "";
		str += "#";
		str += this.elementID;
		str += " ";
		str += encodeURIComponent(this.contents);
		str += "\n";
		return str;
	}
	copyFrom(e: MGDatabaseAtomElement): void
	{
		this.elementID = e.elementID;
		this.contents = e.contents;
	}
}

class MGDatabaseRelationElement implements MGDatabaseElement
{
	public elementID: string;
	public typeElementID: string;
	public elementIDList: Array<string>;
	//
	constructor(typeID?: string, eIDList?: Array<string>)
	{
		this.typeElementID = UUID.verifyUUID(typeID);
		if(!this.typeElementID){
			this.typeElementID = UUID.nullUUID;
		}
		this.elementIDList = new Array();
		if(eIDList instanceof Array){
			for(var i = 0; i < eIDList.length; i++){
				this.elementIDList[i] = UUID.verifyUUID(eIDList[i]);
				if(!this.elementIDList[i]){
					this.elementIDList[i] = UUID.nullUUID;
				}
			}
		}
	}
	//
	loadStringRepresentation(str: string): string
	{
		// retv: elementID
		var p: number;
		if(str[0] !== "$"){
			console.log("loadStringRepresentation: str is not valid.");
			return null;
		}
		this.elementID = UUID.verifyUUID(str.substr(1, 32 + 4));
		p = 32 + 4;
		//
		p = str.indexOf("#", p) + 1;
		if(p == 0){
			console.log("loadStringRepresentation: str is not valid.");
			return null;
		}
		this.typeElementID = UUID.verifyUUID(str.substr(p, 32 + 4));
		//
		this.elementIDList = new Array();
		for(var i = 0; ; i++){
			p = str.indexOf("#", p) + 1;
			if(p == 0){
				break;
			}
			this.elementIDList[i] = UUID.verifyUUID(str.substr(p, 32 + 4));
		}
		return this.elementID;
	}
	getStringRepresentation(): string
	{
		// 末尾には改行文字が自動で付加されます。
		var str = "";
		//
		str += "$";
		str += this.elementID;
		//
		str += " #";
		str += this.typeElementID;
		for(var i = 0; i < this.elementIDList.length; i++){
			str += " #";
			str += this.elementIDList[i];
		}
		str += "\n";
		return str;
	}
	copyFrom(e: MGDatabaseRelationElement): void
	{
		this.elementID = e.elementID;
		this.typeElementID = e.typeElementID;
		this.elementIDList = e.elementIDList.copy();
	}
}

class MGDatabaseQuery
{
	private conditionalFunc: Function;	// function(objInstance){};
	private nextIndex: number = 0;
	private hasReachedEnd: boolean = false;
	private list: Array<MGDatabaseElement>;

	constructor(db: MGDatabase, domain?: string)
	{
		// domainは省略可能で、指定するならばatom, relation, elementsのいずれかである。
		this.list = db.elementList;
		switch(domain){
			case "atom":
				this.list = db.atomList;
				break;
			case "relation":
				this.list = db.atomList;
				break;
		}
	}
	//
	setCondition(conditionalFunc: Function)
	{
		this.conditionalFunc = conditionalFunc;
		this.nextIndex = 0;
		this.hasReachedEnd = false;
	}
	getNextMatched(): any
	{
		if(!this.conditionalFunc){
			return false;
		}
		for(var i = this.nextIndex, iLen = this.list.length; i < iLen; i++){
			if(this.conditionalFunc(this.list[i])){
				this.nextIndex = i + 1;
				return this.list[i];
			}
		}
		this.hasReachedEnd = true;
		return false;
	}
}
