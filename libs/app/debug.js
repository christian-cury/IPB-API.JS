
/**
 * Expose contructor
 */

module.exports = Debug;


function Debug(enabled) {
   this.log = function(msg) { if(enabled) console.log(msg); }
   this.dir = function(msg) { if(!enabled) console.dir(msg); }
   this.warn = function(msg) { console.warn(msg); }
   this.error = function(msg) { console.error(msg); }
}
