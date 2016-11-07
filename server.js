//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login');
var signup=require('./services/signup');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/ebay";
//var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./services/mongo");


var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready',function() {
	console.log("connected to signup queue");
	cnn.queue('signup_queue', function (q) {
		q.subscribe(function (message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			signup.handleSignup(message, function (err, res) {
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					correlationId: m.correlationId
				});


			})
		})
	})
})

cnn.on('ready',function() {
	console.log("connected to homepage queue");
	cnn.queue('homepage_Queue', function (q) {
		q.subscribe(function (message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			login.handleHomepage(message,function (err,res) {
				cnn.publish(m.replyTo,res,{

					   contentType: 'application/json',
						contentEncoding: 'utf-8',
						correlationId: m.correlationId

				})

			})


		})
	})
});


cnn.on('ready',function() {
	console.log("connected to homepage queue");
	cnn.queue('bid_Queue', function (q) {
		q.subscribe(function (message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			login.bidHandle(message,function (err,res) {
				cnn.publish(m.replyTo,res,{

					contentType: 'application/json',
					contentEncoding: 'utf-8',
					correlationId: m.correlationId

				})

			})


		})
	})
});

cnn.on('ready',function() {
	console.log("connected to homepage queue");
	cnn.queue('addPost_Queue', function (q) {
		q.subscribe(function (message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			login.handlePostAdd(message, function (err, res) {
				cnn.publish(m.replyTo, res, {
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					correlationId: m.correlationId

				})

			})


			cnn.on('ready', function () {
				console.log("connected to homepage queue");
				cnn.queue('order_Queue', function (q) {
					q.subscribe(function (message, headers, deliveryInfo, m) {
						util.log(util.format(deliveryInfo.routingKey, message));
						util.log("Message: " + JSON.stringify(message));
						util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
						login.handlePostOrder(message, function (err, res) {
							cnn.publish(m.replyTo, res, {
								contentType: 'application/json',
								contentEncoding: 'utf-8',
								correlationId: m.correlationId

							})

						})


					})
				})
			})
