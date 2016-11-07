var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";



function handle_request(msg, callback) {

	var res = {};
	console.log("In handle request:" + msg.name);
	mongo.connect(mongoURL, function (db) {
		console.log("hi" + mongoURL);
		var collect = db.collection('users');
		collect.findOne({name: msg.name, password: msg.password}, function (err, users) {
			if (err) {
				throw err;
			}
			else {
				console.log("connected to database");

				if (users) {
					res.code = 200;
					res.value = "successLogin";
					console.log("success");

				}
				else {
					res.code = "401";
					res.value = "Failed Login";
					console.log("is not password");
				}
				callback(null, res);


			}

		})

	});

}

exports.handle_request = handle_request;




function handleHomepage(msg,callback){
	var res={};
	console.log("in homepage handle request");
	mongo.connect(mongoURL, function (db) {
		console.log("hi" + mongoURL);
		var collect = db.collection('inventory');
		collect.find({}).toArray(function (err,results){
		if(err)
		{
			console.log(err);
			throw err;
		}
		else

		{
			console.log("connected to database");
			res=results;
			callback(null,res);
		}
		})
		})
}

exports.handleHomepage=handleHomepage;


/* without pooling handling

var MongoClient=require('mongodb').MongoClient;


exports.connect=function(url,callback){
	MongoClient.connect(url,function(err,_db) {
		console.log(" to here");
		if(err)
		{
			throw new Error('Could not connect: '+err);
		}
		var db = _db;
		connected = true;
		console.log(connected +" is connected?");
		callback(db);

	});

};


/*
exports.collection = function(name){
	if (!connected) {
		throw new Error('Must connect to Mongo before calling "collection"');
	}
	return db.collection(name);

};

function handle_request(msg, callback) {
	var res = {};
	console.log("In handle request:" + msg.name);
	connect(mongoURL,function (db) {
	var collect=collection("users");
		collect.findOne({name: msg.name, password: msg.password},function (err,res) {
			if(err)
			{
				throw err;
			}
			else
			{
				console.log("connected to database");

				if (users) {
					res.code = 200;
					res.value = "successLogin";
					console.log("success");

				}
				else {
					res.code = "401";
					res.value = "Failed Login";
					console.log("is not password");
				}
				callback(null, res);


			}


		})

	})

};
*/



