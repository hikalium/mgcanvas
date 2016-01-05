class MGProlog
{
	db: MGDatabase;
	//
	constructor(db: MGDatabase)
	{
		var that = this;
		//
		this.db = (db instanceof MGDatabase) ? db : new MGDatabase();
	}
	//
	exec(str: string)
	{
		var p: Array<string>;
		var i: number;
		p = str.split(',');
		for(i = 0; i < p.length; i++){
			this.db.addAtom(p[i]);
		}
	}
}
/*
class RPNOperator
{

}

class RPNConvertor
{
	constructor(operatorSet: )
	{

	}
	pushIdentifier: function(identifier){
		var f = this.getFunctor(identifier);
		var t;
		if(this.tmpStringLiteral !== null && identifier !== "\""){
			// string literal and escaped character.
			if(identifier === "\\n"){
				identifier = "\n";
			} else if(identifier === "\\\""){
				identifier = "\"";
			}
			this.tmpStringLiteral += identifier;
			return;
		} else{
			// whitespace character.
			if(	identifier === " " ||
				identifier === "\t" ||
				identifier === "\n"){
				return;
			}
		}
		
		if(f){
			// Functor
			this.pushFunctor(f);
			t = f;
		} else{
			// Operand
			f = identifier;
			if(f === "\""){
				if(this.tmpStringLiteral !== null){
					// end
					t = new MGProlog_Constant(this.tmpStringLiteral);
					this.tmpStringLiteral = null;
				} else{
					// start
					this.tmpStringLiteral = "";
				}
			} else if(f[0] === "$"){
				// Variable
				t = new MGProlog_Variable(f.substring(1));
			} else{
				// Constant
				if(f[0] === "\\"){
					throw "Can't use backslash out of string literal.";
				}
				t = new MGProlog_Constant(f);
			}
			if(t){
				this.pushOperand(t);
			}
		}
		if(t){
			this.literalStack.push(t);
		}
	},
	pushOperand: function(operand){
		if(this.literalStack.length > 0 && !(this.literalStack[this.literalStack.length - 1] instanceof MGProlog_Functor)){
			throw "Unexpected identifier '" + operand.identifier + "'.";
		}
		this.evalStack.push(operand);
	},
	pushFunctor: function(functor){
		// 演算子を追加する。
		// ここで追加する演算子は仮のもので、実行時に正しいアリティの演算子を取得し実行する。
		var fstr = functor.functor;
		// この場所にFunctorが置けるかどうかを確認する
		///*
		if(this.literalStack.length > 0 && this.literalStack[this.literalStack.length - 1] instanceof MGProlog_Functor){
			if(	fstr === "." ||
				fstr === "," ||
				fstr === "(" ||
				fstr === ")" ||
				false){
				// do nothing.
			} else{
				throw "Unexpected identifier '" + fstr + "'.";
			}
		}
		//
		if(fstr == "("){
			//開き括弧のevalFunctorStack内でのIndexを記憶
			if(	this.literalStack.last() instanceof MGProlog_Constant ||
				this.literalStack.last() instanceof MGProlog_Variable ||
				(this.literalStack.last() instanceof MGProlog_Functor && this.literalStack.last().opAssoc === "f")){
				// 関数呼び出しの括弧
				// -(index + 1)で記憶しておく
				this.startBracketIndexStack.push(-(this.evalFunctorStack.length + 1));
				if(	this.evalStack.last() instanceof MGProlog_Constant || 
					this.evalStack.last() instanceof MGProlog_Variable){
					// 関数名に当たる部分をConstantからFunctorに変更しておく
					var f = new MGProlog_Functor(this.evalStack.last().identifier, 2, 1000, "f", this.env.FunctorRawFunc.internal_relation);
					f.relObj = this.evalStack.last();
					this.evalStack[this.evalStack.length - 1] = f;
				}
				// 式解釈モードを変更
				this.parseModeStack.push(this.ParseMode.InArg);
			} else{
				//式の優先順位を示す括弧
				this.startBracketIndexStack.push(this.evalFunctorStack.length);
				this.parseModeStack.push(this.ParseMode.Normal);
			}
			this.evalFunctorStack.push(functor);
		} else if(fstr == ")"){
			//開き括弧のインデックスを得る
			//開き括弧までのFunctorを順にevalStackにpushして、括弧内の式を完結させる
			var i = this.startBracketIndexStack.pop();
			for(;;){
				var o = this.evalFunctorStack.pop();
				if(o === undefined){
					//括弧の個数が合わないのでエラー
					throw "Unexpected identifier '" + fstr + "'.";
				} else if(o.functor == "("){
					break;
				}
				this.evalStack.push(o);
			}
			if(i < 0){
				//関数呼び出しの括弧
				this.evalStack.push("()");
			}
			this.parseModeStack.pop();
		} else if(fstr == ","){
			if(this.parseModeStack.last() === this.ParseMode.InArg){
				// 関数の引数を分割するカンマ
				// 現在の階層の式を完結させる
				for(;;){
					var o = this.evalFunctorStack.pop();
					if(o === undefined){
						// すべてプッシュしたので終了
						break;
					} else if(o.functor == "("){
						// 開き括弧なのでここでおしまい。括弧は戻しておこう。
						this.evalFunctorStack.push(o);
						break;
					}
					this.evalStack.push(o);
				}
			} else{
				// comma as a general functor
				this.pushFunctor_general(functor);
			}
		} else if(fstr == "."){
			// トップレベルの式を完結させる
			for(;;){
				var o = this.evalFunctorStack.pop();
				if(o === undefined){
					// すべてプッシュしたので終了
					break;
				} else if(o.functor == "("){
					// 開き括弧が来るはずない！だってトップレベルだから。
					throw "'.' in Non-top level. Check pairs of brackets.";
				}
				this.evalStack.push(o);
			}
			this.evalStack.push(".");
		} else{
			// a general functor
			this.pushFunctor_general(functor);
		}
	},
	pushFunctor_general: function(functor){
		if(functor.opAssoc === "f"){
			// 引数リスト形式Functor
			this.evalStack.push(functor);
		} else{
			// 中置・後置・前置Functor
			var p = functor.priority;
			for(var i = 0, iLen = this.evalFunctorStack.length; i < iLen; i++){
				var o = this.evalFunctorStack.pop();
				if(o.priority <= p){
					// 優先順位が同じか、より高い演算子が取り置かれていたら、それを先に評価スタックに積む。
					this.evalStack.push(o);
				} else{
					// 自分より優先順位の高い演算子が左側にいないので、やっぱり取り置いておこう。
					this.evalFunctorStack.push(o);
					break;
				}
			}
			this.evalFunctorStack.push(functor);
		}
	},
	getFunctor: function(pStr, arity){
		if(arity){
			return this.env.functorList.includes([pStr, arity],this.getFunctorWithArity_fEqualTo);
		} else{
			return this.env.functorList.includes(pStr,this.getFunctor_fEqualTo);
		}
	},
	//
	// fEqualTo
	//
	getFunctor_fEqualTo: function(a, b){
		return a.functor === b;
	},
	getFunctorWithArity_fEqualTo: function(a, b){
		return a.functor === b[0] && a.arity === b[1];
	},
}
*/
