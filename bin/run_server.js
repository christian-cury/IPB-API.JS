#!/usr/bin/env node

/**
* Invision Power Board API for Node.JS
*
* @author Paweł "Siper" Klebba <siper@mlppolska.pl>
* @copyright 2014 MLPPolska.PL
* @version         $Id$
* @license MIT License
* @link http://github.com/MLPPolska/IPB-API.JS
*/

var API = require("../libs/app"),
    config = require("../config.json"),
    url = require('url');


// Create New API Instance and init it.
API = new API(config);
API.init(main);


function main() {

	// Create GET Request
	API.Server.Express.get("*", function(req,res){
		
		var path = url.parse(req.url).pathname;

	    // split and remove empty element;
	    path = path.split('/').filter(function (e) {
	        return e.length > 0;
	    });

	    // lookup method in Modules:
	    var method = API.Modules;
	    path.forEach(function (field) {
	    	if(!method[field]) return API.Utils.makeResponse(404, {message: "That method doesn't exists."}, req, res);
	        method = method[field];
	    })

	    if(typeof(method) == "function")
	    	return method(API, req, res);

	    // Null parameters
		return API.Utils.makeResponse(400, {message: "Please type your method."}, req, res);
	});

}

process.on('SIGINT', function() {
    console.log("\nBye <3");
    process.exit();
});