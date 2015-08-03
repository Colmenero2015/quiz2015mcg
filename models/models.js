var path=require('path');
//postgres DATABASE_URL=postgres://user:password@host:port/database
//SQLite DATABASE_URL=sqlite://:@:/
var url=process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name=(url[6]||null);
var user=(url[2]||null);
var pwd=(url[3]||null);
var protocol=(url[1]||null);
var dialect=(url[1]||null);
var port=(url[5]||null);
var host=(url[4]||null);
var storage=process.env.DATABASE_STORAGE;

//cargar modelo orm
var Sequelize=require('sequelize');
//usar db sqlite o postgres
var sequelize=new Sequelize(DB_name,user,pwd,
	{
		dialect:protocol,
		protocol:protocol,
		port:port,
		host:host,
		storage:storage,  //solo sqlite (.env)
		omitNull:true  //solo postgres
	});
//importar la definicion de la tabla Quiz con quiz.js
var quiz_path=path.join(__dirname,'quiz');
var Quiz=sequelize.import(quiz_path);
exports.Quiz=Quiz; //exportar definicion de la tabla Quiz
//sequelize.sync() crea e inicializa la tabla de preguntas en db
sequelize.sync().then(function(){	//success ejecuta el manejar una vez creada la tabla
	Quiz.count().then(function(count){
		if(count===0){ // la tabla se inicicializa solo si esta vacia
			Quiz.create({
				pregunta:'Capital de Italia',
				respuesta:'Roma',
				tema:'otro'});
			Quiz.create({
				pregunta:'Capital de Portugal',
				respuesta:'Lisboa',
				tema:'otro'
			}).then(function(){
			console.log('Base de datos inicializada')
		})};
	});
});