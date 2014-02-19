/**
 * IPB Login Library
 *
 * @author Paweł "Siper" Klebba <siper@mlppolska.pl>
 * @copyright 2014 MLPPolska.PL
 * @version         $Id$
 * @license MIT License
 * @link http://github.com/MLPPolska/IPB-API.JS
 */


/**
 * Library instance
 *
 * @api private
 */
var Login = function(API) {

    /**
     * Checks user is logged in.
     *
     * @api public
     */
    this.getLoginData = function(req, callback) {
        if (!callback) return;

        if (req.method == "GET")
            req.body = require('url').parse(req.url, true).query;

        // We using username & password or loginkey?
        if (req.body.username && req.body.password) {
            API.Database.get("members", {
                where: "name = :name",
                values: {
                    name: req.body.username
                }
            }, function(result) {
                if (API.Utils.hashPassword(req.body.password, result.members_pass_salt) !== result.members_pass_hash) {
                    console.log('User ' + result.name + ' could not log in');
                    callback(false);
                } else {
                    return callback(result);
                }
            });

        } else if (req.body.loginkey) {
            API.Database.get("members", {
                where: "member_login_key = :key",
                values: {
                    key: req.body.loginkey
                }
            }, function(result) {
                return callback(result);
            });
        } else return callback(false);
    };
};


module.exports = Login;
