var models=require('../models/models.js');

//Autoload factiriza el codigo si ruta incluye :quizId
exports.load=function(req,res,next,quizId){
	models.Quiz.findById(quizId).then(function(quiz){
		if(quiz){
			req.quiz=quiz;
			next();
		}else{next(new Error('No existe quizId='+quizId));}
	}).catch(function(error){next(error);});
};
// get /quizes/:id
exports.show=function(req,res){
	res.render('quizes/show', {quiz:req.quiz});	
};
// get /quizes/:id/answer
exports.answer=function(req,res){
	var resultado='Incorrecto';
	if(req.query.respuesta===req.quiz.respuesta){
		resultado='Correcto';}
		res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado});
};
//get /quizes
exports.index=function(req,res){
	if(req.query.search!=""){
		var info=(req.query.search||"").replace(" ","%");
	}else{info="";}
	models.Quiz.findAll({where:['pregunta like ?','%'+info+'%'],order:'pregunta ASC'}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes});
	}).catch(function(error){next(error);});
};
