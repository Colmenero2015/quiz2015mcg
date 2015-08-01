var models=require('../models/models.js');

// get /quizes/:id
exports.show=function(req,res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
	res.render('quizes/show', {quiz:quiz});	
	})
};
// get /quizes/:id/answer
exports.answer=function(req,res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(req.query.respuesta===quiz.respuesta){
		res.render('quizes/answer',{quiz:quiz,respuesta:"Correcto"});
	}else{
		res.render('quizes/answer',{quiz:quiz,respuesta:"Incorrecto"});
	}
	})

};
//get /quizes
exports.index=function(req,res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs',{quizes:quizes});
	})
};
