fs = require('fs');

module.exports = function(API) {

    return function(cb) {


        // Get all avaitable modules
        files = fs.readdirSync("./modules");
        for (var file in files) {
            API.Debug.log("- Init module `" + files[file] + "`...");
            if (files[file] != '.')
                if (fs.statSync("./modules/" + files[file]))
                    if (fs.existsSync("./modules/" + files[file] + "/index.js"))
                        API.initModule(files[file]);
                    else
                        API.Debug.log("-- This is not module, file ./modules/" + files[file] + "/index.js doesn't exists");

            if (files.length - 1 == file) cb();
        }

    };
};
