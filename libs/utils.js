module.exports = function(){
	this.makeResponse = function(code, response, req, res) {
		var status;
		switch(code) {
			case 200:
				status = "OK";
				break;
			case 400:
				status = "INVALID REQUEST";
				break;
			case 403:
				status = "FORBIDDEN";
				break;
			case 404:
				status = "NOT FOUND";
				break;
			case 500:
				status = "SERVER ERROR";
				break;
		}

		var output = {
			statusCode : code,
			statusText : status,
			response : response
		};

		if(req && res)
			res.json(output);
		else
			return output;

	};

	this.hashPassword = function(password, salt){
	    if( password == null || salt == null)
	        return '';
    	return this.md5(this.md5(salt)+this.md5(password));
	};

	this.md5 = function(string){
    	return require("crypto").createHash('md5').update(string).digest('hex'); 
	};

};