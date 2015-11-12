
//
// UUID
//
class UUID
{
	static nullUUID: string = "00000000-0000-0000-0000-000000000000";
	static verifyUUID(uuid: string): any
	{
		// retv: normalized UUID or false.
		if(!uuid || uuid.length != (32 + 4)){
			return false;
		}
		return uuid.toLowerCase();
	}
	static convertFromHexString(hex: string): any
	{
		if(hex.length != 32){
			return false;
		}
		return this.verifyUUID(
			hex.substr( 0, 8) + "-" + 
			hex.substr( 8, 4) + "-" + 
			hex.substr(12, 4) + "-" + 
			hex.substr(16, 4) + "-" + 
			hex.substr(20, 12)
		);
	}
	static convertFromBase64String(b64Str: string): any
	{
		var hex: string = "";
		var tmp: number = 0;
		var i: number;
		
		if(b64Str.length === 22){
			// 末尾の==なしも許容
			b64Str += "==";
		}
		for(i = 0; i < b64Str.length; i++){
			var c: number = b64Str.charCodeAt(i);
			tmp <<= 6;
			if(0x41 <= c && c <= 0x5a){
				// 0x00-0x19
				tmp |= (c - 0x41);
			} else if(0x61 <= c && c <= 0x7a){
				// 0x1a-0x33
				tmp |= (c - 0x61 + 0x1a);
			} else if(0x30 <= c && c <= 0x39){
				// 0x34-0x3d
				tmp |= (c - 0x30 + 0x34);
			} else if(c === 0x2b){
				// 0x3e
				tmp |= 0x3e;
			} else if(c === 0x2f){
				// 0x3f
				tmp |= 0x3f;
			} else if(c === 0x3d){
				// padding
			} else{
				throw "Invalid Base64 String.";
			}
			if((i & 3) === 3){
				hex += tmp.toString(16);
				tmp = 0;
			}
		}
		hex = hex.substr(0, 32);
		return UUID.convertFromHexString(hex);
	}
	static generateVersion4(): string
	{
		var g = this.generate16bitHexStrFromNumber;
		var f = this.generateRandom16bitHexStr;
		var n = this.generateRandom16bitHex;
		return f() + f() + "-" + f() + "-" + g(0x4000 | (n() & 0x0fff)) + "-" + g(0x8000 | (n() & 0x3fff)) + "-" + f() + f() + f();
	}
	private static generateRandom16bitHexStr(): string
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).toLowerCase().substring(1);
	}
	private static generateRandom16bitHex(): number
	{
		return ((Math.random() * 0x10000) | 0);
	}
	private static generate16bitHexStrFromNumber(num: number): string
	{
		return (num + 0x10000).toString(16).toLowerCase().substring(1);
	}
	static getBase64EncodedUUID(uuid: string): string
	{
		uuid = this.verifyUUID(uuid);
		if(!uuid){
			return null;
		}
		uuid = uuid.replaceAll("-", "") + "0000";
		var retv = "";
		var f = function(n: number){
			if(0 <= n && n < 26){
				return String.fromCharCode(0x41 + n);
			} else if(26 <= n && n < 52){
				return String.fromCharCode(0x61 + (n - 26));
			} else if(52 <= n && n < 62){
				return String.fromCharCode(0x30 + (n - 52));
			} else if(62 <= n && n < 64){
				return (n == 62) ? "+" : "/";
			}
		};
		for(var i = 0; i < 6; i++){
			var chunk = parseInt(uuid.substr(i * 6, 6), 16);
			retv += f(0x3f & (chunk >> 18));
			retv += f(0x3f & (chunk >> 12));
			retv += f(0x3f & (chunk >> 6));
			retv += f(0x3f & chunk);
		}
		retv = retv.substr(0, 22) + "==";
		return retv;
	}
}
