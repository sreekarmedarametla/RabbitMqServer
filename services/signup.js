/**
 * Created by Chaitu on 11/5/2016.
 */

var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";

exports.handleSignup=function(msg,callback){
    var res={};
    mongo.connect(mongoURL,function(mdb) {
        console.log("connected to mongo at"+mongoURL);
        var coll=mdb.collection("newUser");
        coll.insertOne({
            "firstname": msg.firstname,
            "lastname":msg.lastname,
            "email":msg.email,
            "password":msg.password

        },function (err,res) {
            if(err){
                //throw err;
                console.log("error while inserting");
                res.statusCode=401;
                callback(null,res);
            }
            else
            {
                console.log('succesfully inserterd');
                res.statusCode=200;
                callback(null,res);
            }

        })
    })
}


