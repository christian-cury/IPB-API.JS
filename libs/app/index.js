/**
* Module dependencies.
*/

var   database = require('../database'),
      express = require('express'),
     // http = require('http'),
      socketio = require('socket.io'),
      debuglib = require('./debug.js'),
      bootstrap = require('./bootstrap.js'),
      utils = require('../utils'),
      login = require('../login');


/**
 * Expose contructor
 */

module.exports = API;


/**
* API constructor
*
* @api private
*/

function API(config) {
   if(!config) { 
      console.error(' [API-ERR] Config is not defined.'); 
      return false;
   }

   /**
    * Modules
    * 
    * @api public
    */
   this.Modules = {};

   /**
    * Server
    * 
    * @api public
    */
   this.Server = {};

   /**
    * Utils
    * 
    * @api public
    */
   this.Utils = new utils;

   /**
    * Database
    * 
    * @api public
    */
   this.Database = database;

   /**
    * Login
    * 
    * @api public
    */
   this.Login = new login(this);


   /**
    * Express
    * 
    * @api public
    */
   this.Server.Express = express();

   /**
    * Load configuration
    * 
    * @api private
    */
   this.config = config;

   // Set default variables for port and hostname
   this.config.port = this.config.port || process.env.port || 8080;
   this.config.host = this.config.host || process.env.host || "localhost";

   /**
    * Init Debugger when is enabled.
    *
    * @api private
    */
   this.Debug = new debuglib(this.config.debug_enabled);

   /**
    * Init new Module
    *
    * @api private
    */
   this.initModule = function(module) {
      if(!module) return;

      // Do optional tests before add module
      try {
        var test = require(__dirname + "/../../modules/" + module + "/test.js");
        test(function(err){
          if(err) {
            this.Debug.error("[ERR] Couldn't add "+module+" module!");
            this.Debug.error("[ERR] " + err);
          }
          else {
            this.Modules[ module ] = require(__dirname + "/../../modules/" + module + "/index.js");
            this.Debug.log("-- Hello, `"+module+"` module!");
          }
        });
      }
      catch(e) {
        this.Debug.warn("-- Module "+module+" has no testing file.");
        this.Modules[ module ] = require(__dirname + "/../../modules/" + module + "/index.js");
        this.Debug.log("--- Hello, `"+module+"` module!");
        
      }

   }

   /**
    * API.prototype.bootstrapModules()
    *
    * Bootstraps modules
    */
   this.bootstrapModules = function(cb) {
      var API = this; 
      API.Debug.log("Bootstraping modules...");
      bootstrap(API)(function(err){
         if(err) return cb(err);
         API.Debug.log("... Loaded all modules!");
         if(cb) cb();
      });
   };

   /**
    * API.prototype.runServer()
    *
    * Run HTTP and Socket.IO Server
    */
   this.runServer = function(cb) {
       var API = this;

       API.Debug.log("Running Server at " + API.config.host + ":" + API.config.port + "...");

       // Add Middleware for Express
       API.Server.Express.use(express.bodyParser());

       API.Server.server = API.Server.Express.listen(API.config.port, API.config.host);
       API.Server.io = socketio.listen(API.Server.server);
              
       if(API.config.debug_enabled) API.Server.io.set('loglevel',10);

       if(cb) cb();
   };

   /**
    * API.prototype.init()
    *
    * Init everything...
    */
   this.init = function(cb) {
      var API = this;
      
      API.bootstrapModules(function(){
         API.runServer(function(){
            API.Debug.log("I'm initialized!");
            if(cb) cb();
         });
      });
   }
}
