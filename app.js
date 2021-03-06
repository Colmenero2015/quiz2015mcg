var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials=require('express-partials');
var methodOverride=require('method-override');
var session=require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




// uncomment after placing your favicon in /public
app.use(methodOverride('_method'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser('Quiz 2015'));
app.use(session());

//autoload Control de tiempo de la sesion
app.use(function(req,res,next){
	if(req.session.user){ //si el usuario esta logeado
		if(req.session.user.tiempo){ //si tiene tiempo de inicio asignado
			if(new Date().getTime()-req.session.user.tiempo>120000){ //si el tiempo excede 2 mins
				delete req.session.user;  //borra la sesion de usuario
				//delete req.session.tiempo; //borra variable tiempo
				//res.redirect('/login'); //solicita nuevo login
				}else{req.session.user.tiempo=new Date().getTime()}; //reinicia tiempo asignado}
			}else{ //no tiene tiempo asignado
				req.session.user.tiempo=new Date().getTime(); //asigna tiempo de inicio
		}
	}
	next();
});

app.use(express.static(path.join(__dirname, 'public')));
//helpers dinamicos
app.use(function(req,res,next){
    //guardar path en session.redir para despues de login
    if(!req.path.match(/\/login|\/logout/)){
    req.session.redir=req.path;}
    //hacer visible req.session en las vistas
    res.locals.session=req.session;
    next();
});
app.use(partials());

app.use('/', routes);

//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},errors:[]
    });
});



module.exports = app;
