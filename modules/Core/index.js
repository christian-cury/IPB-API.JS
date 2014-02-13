/**
* IPB-API.JS Core Modules
*
* @author Paweł "Siper" Klebba <siper@mlppolska.pl>
* @copyright 2014 MLPPolska.PL
* @version         $Id$
* @license MIT License
* @link http://github.com/MLPPolska/IPB-API.JS
*/

function Core(){
   this.Messenger = new Messenger();
};

function Messenger(){
	this.getNotifications = function(API, req, res) {

		API.Database.get("inline_notifications", {
			what: "p.notify_read, p.notify_sent, p.notify_title, j1.members_display_name",
			where: "p.notify_to_id = 472",
			join: {
				members: "p.notify_from_id = j1.member_id"
			},
			order: "p.notify_sent DESC",
			limit: "0,30"
		}, function(data){
			return API.Utils.makeResponse(200, data, req, res);
		});

	};
};

module.exports = new Core;
