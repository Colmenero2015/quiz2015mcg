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
	res.render('quizes/show', {quiz:req.quiz,errors:[]});	
};
// get /quizes/:id/answer
exports.answer=function(req,res){
	var resultado='Incorrecto';
	if(req.query.respuesta===req.quiz.respuesta){
		resultado='Correcto';}
		res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado,errors:[]});
};
//get /quizes
exports.index=function(req,res){
	if(req.query.search!=""){
		var info=(req.query.search||"").replace(" ","%");
	}else{info="";}
	models.Quiz.findAll({where:['pregunta like ?','%'+info+'%'],order:'pregunta ASC'}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes,errors:[]});
	}).catch(function(error){next(error);});
};
//get /quizes/new
exports.new=function(req,res){
	var quiz=models.Quiz.build(//crea objeto quiz
		{pregunta:"Pregunta",respuesta:"Respuesta"});
	res.render('quizes/new',{quiz:quiz,errors:[]});
};
//post /quizes/create
exports.create=function(req,res){
	var quiz=models.Quiz.build(req.body.quiz);
	//guarda en Db los campos pregunta y respuesta de quiz
	quiz
	.validate()
	.then(
		function(err){
			if(err){
			res.render('quizes/new',{quiz:quiz,errors:err.errors});
	}else{
		quiz
		.save({fields:["pregunta","respuesta"]})
		.then(function(){
		res.redirect('/quizes');  //redireccion a lista de preguntas
	})
}});};
