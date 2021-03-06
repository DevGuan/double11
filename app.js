
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;



if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  
	var app = express();

	//年双十一活动商品清单-价格提前曝光-已解密
	// all environments
	app.set('port', process.env.PORT || 80);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.favicon(path.join(__dirname, 'public/favicon.ico'))); 
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({secret: '1234567890QWERTY'}));
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}


	app.get('/tag/:tag', routes.tag);
	app.get('/brands/:brands', routes.brands);
	app.get('/search', routes.search);
	app.get('/', routes.index);
	app.use(function(err, req, res, next) {
	    if(!err) return next(); // you also need this line
	    console.log("error!!!");
	    res.send("error!!!");
	});




	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});


}



