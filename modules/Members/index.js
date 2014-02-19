/**
 * IPB-API.JS Members Modules
 *
 * @author Paweł "Siper" Klebba <siper@mlppolska.pl>
 * @copyright 2014 MLPPolska.PL
 * @version         $Id$
 * @license MIT License
 * @link http://github.com/MLPPolska/IPB-API.JS
 */

function Members() {
    this.Me = new Me();
}

function Me() {

    this.getData = function(API, req, res) {

        API.Login.getLoginData(req, function(user) {

            if (!user) return API.Utils.makeResponse(403, {
                message: "User is not logged in."
            }, req, res);

            // Unset some highly important variables (eg. password hash)
            delete user.members_pass_hash;
            delete user.members_pass_salt;
            delete user.fb_token;

            return API.Utils.makeResponse(200, user, req, res);
        });
    };
}

module.exports = new Members();
