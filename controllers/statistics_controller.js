var models=require('../models/models.js'); //IMPORTA DEFINICION
//get /statistics/show
exports.show=function(req,res,next){
	models.Comment.count().then(
		function(comments){
			models.Quiz.count().then(
				function(quizes){
					models.Comment.countCommentedQuizes().then(function(preCom){
						res.render('statistics/show.ejs', {quizes:quizes,comments:comments,preCom:preCom,errors:[]});
					}
				)})}).catch(function(error){next(error)});
};

