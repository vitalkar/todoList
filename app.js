var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;

app.set('view engine', 'pug');
app.set('views','./views/pages');
app.use('/public',express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var todoDataSchema = new Schema({
	list:{type: String, required: true},
	header:{type: String, required: true},
	description:String,
	date:{type:Date, default:Date.now}
}); 

var userSchema = new Schema({
	username:{type: String, required: true},
	password:{type: String, required: true},
	lists: {type: Array}
});

var Todo = mongoose.model('Todo',todoDataSchema);
var User = mongoose.model('User',userSchema);

mongoose.connect('mongodb://localhost/todos_db',{
	useMongoClient: true,
});

app.get('/todos',function(req,res){
	//load todos form server and send via ajax to the client
	//transform the collection to an array and send it to client js
	//
	// db.collection('todos')
	Todo.find({},function(err,docs){
		if(err)
			throw err;
		else
			res.render('todos',{todos:docs});
	});

});

app.get('/getTodos',function(req,res){
	Todo.find({},function(err,docs){
		if(err)
			throw err;
		else
			res.json(docs);
	});
});

app.post('/todos',function(req,res){
	console.log('req body: '+ JSON.stringify(req.body));
	var todoData = req.body;

	//create a todo object
	
	var newToDo = new Todo({
		list: todoData.list,
		header: todoData.header,
		description: todoData.description,
		date: todoData.date
	});
	
	//try to use save
	//try to change the code when it is one data base	
	db.collection('todos').insertOne(newToDo,function(err,res){
		if(err)
			throw err;
		else
			console.log('1 todo inserted');
	});

});

//update
app.put('/todos',function(req,res){
	
	var todoData = req.body;
	var updatedTodo = {'header': todoData.header , 'description': todoData.description };
	Todo.findOneAndUpdate(todoData.id ,updatedTodo,function(err,res){
		if(err)
			throw err;
		else
			console.log('updated');
	});
});

//delete
app.delete('/todos',function(req,res){
	console.log(req.body);
	var removeTodoHeader = req.body;
	Todo.remove(removeTodoHeader,function(err){
		if(err)
			throw err;
		else
			console.log('removed');
	});

	// res.redirect('/todos');
	// res.send('received the request');
});





app.listen(3000,function(){
	console.log('listening on port 3000');
});
