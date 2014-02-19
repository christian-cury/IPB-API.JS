exports.databaseConfig = function(test){
    var config = require('../config.json');

    if(config.database)
        test.ok(true);
    else
        test.ok(false, "Cannot find database config");

    test.expect(1);
    test.done();
};

exports.databaseConnect = function(test){
    var Database = require('../libs/database');
    var c = Database.connect();

    c.connect(function(err){
        if(err) 
            test.ok(false, "Cannot connect with the database => " + err);
        else 
       	    test.ok(true);

       	test.expect(1);
        test.done();
    });
};