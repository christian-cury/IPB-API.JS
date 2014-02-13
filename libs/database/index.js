/**
* IPB-API.JS Database Library
*
* @author Paweł "Siper" Klebba <siper@mlppolska.pl>
* @copyright 2014 MLPPolska.PL
* @version         $Id$
* @license MIT License
* @link http://github.com/MLPPolska/IPB-API.JS
*/

var config = require('../../config.json'),
	mysql = require('mysql');


/**
* Database constructor
*
* @api private
*/
var Database = function(){
	if(!config.database) { 
      console.error(' [API-ERR] Database parameters is not defined.'); 
      return false;
    }
	this.config = config.database;

	/**
    * Connect to database 
    * 
    * @api private
    */
    this.connect = function(){
    	var connection = mysql.createConnection( this.config );

        // Change query format
        connection.config.queryFormat = function (query, values) {
          if (!values) return query;
          return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
              return this.escape(values[key]);
            }
            return txt;
          }.bind(this));
        };

        return connection;
    };

    /**
    * GET from Database
    * 
    * @api public
    */
    this.get = function(from, options, callback){
    	if(!callback) return;

    	// Check options are defined, if not - create default.
    	if(!options.what)
    		options.what = "*";

    	// Create short variable with database prefix
    	var p = this.config.prefix;


    	from = p + from;
    	if(options.join) from += " p";
    	var query = "SELECT " + options.what + " FROM " + from;


    	// JOIN
    	if(options.join)
    	{
    		var join_count = 0;
    		for(i in options.join)
    		{
    			query += " LEFT JOIN " + p + i + " j" + (++join_count) + " ON (" + options.join[i] + ")";
    		}
    	}

    	if(options.where)
    		query += " WHERE " + options.where;


    	if(options.order)
    		query += " ORDER BY " + options.order;

    	if(options.limit)
    		query += " LIMIT " + options.limit;

    	query += ";";

    	// And do query to Database and return it.
    	var output = [];

        if(!options.values) options.values = {};

        var c = this.connect();
    	c.query(query, options.values)
        .on('error', function(err){
    		console.log(err);
        	callback(new Error(err));
	    }).on('result', function(data){
	    	output.push(data);
	    });
	    c.end(function(){
	    	callback(output[0]);
	    });
	    
	};
};


module.exports = new Database;