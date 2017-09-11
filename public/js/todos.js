

var todos = [];

$(document).ready(function(){
	 fetchTodos();
});

function fetchTodos(){
	$.ajax({
		    url: '/getTodos',
		    type: 'GET',
		    success: function(data){todos = data; console.log(todos); }, 
		    dataType: 'json'
		  });
};

//edit todo data
$('#todoList').on('click','.fa-pencil-square-o',function(){
	var todoHeader = $(this).siblings('p').text();
	var todoDesc = $(this).siblings('small').text();
	var todoId = $(this).siblings('p').attr('id');
	console.log('header: ' + todoHeader + 'Desc: ' + todoDesc + 'id: ' + todoId);
	//display editable todo data
	$(this).parent().replaceWith('<li class="todo">'
		+'<p><input id="' + todoId +'" class="headerInput" type="text" value="' + todoHeader + '"></p>'
		+'<small><input class ="descInput" type="text" placeholder="description" value="' + todoDesc +  '"></small>'
		+'<button class="saveUpdateBtn">save</button> <button class="cancelUpdateBtn">cancel</button>'
		+'</li>');
});

//event delegation
$('#todoList').on('click','.saveUpdateBtn',function(){
	console.log('save btn clicked');
	var header = $(this).siblings('p').children('.headerInput').val();
	var desc = $(this).siblings('small').children('.descInput').val();
	var id = $(this).siblings('p').children('.headerInput').attr('id');
	//save & display new todo fields
	
	$.ajax({
		    url: '/todos',
		    type: 'PUT',
		    success:  updateCallback(),
		    data: {'id' : id ,'header': header , 'description' : desc },
		    dataType: 'application/json'
		  });

	//update the global array of todos
	var index = todos.indexOf(id);
	todos[index].header = header;
	todos[index].description = desc;	

});


$('#todoList').on('click','.cancelUpdateBtn',function(){
	//get the id attribute value from the input
	var id = $(this).siblings('p').children('.headerInput').attr('id');
	
	//find the coresponding todo item in the global todos array and pass its values
	var todo = todos.find(function(item){return item._id === id });
	replaceData(this,todo.header,todo.description,todo._id);	
});

//display static todo data
function replaceData(ref,header,desc,id){
	//
	$(ref).parent().replaceWith(
		'<li class="todo">'
		+'<p id="' + id + '">' + header + '</p>'
		+'<small>' + desc + '</small>'
		+'<i class="fa fa-trash-o"></i>'
		+'<i class="fa fa-pencil-square-o"></i>'
		+'</li>'
        );
};

$('#addTodo').on('click',function(e){
	//retrieve current todo data, send it to the server and then, get the updated list from the server
	console.log('clicked');
	// console.log('e:' + JSON.stringify(e));
});

$("#todoform").submit(function() {
    var formData = $("#todoform").serializeArray();
    var data = {
    	'list': 'first list',
    	'header' : formData[0].value,
    	'description': formData[1].value,
    	'date': Date.now()
    };
    
    console.log('form data' + data);

	$.ajax({
	  type: "POST",
	  url: '/todos',
	  data: data,
	  success: insertCallback()
	});

	fetchTodos();
});


function deleteCallback(){console.log('success to delete'); window.location.reload();};
function updateCallback(){console.log('success to update'); window.location.reload();};
function insertCallback(){console.log('success to insert'); window.location.reload();};


//remove a todo
$('.fa-trash-o').on('click',function(e){
	var todoHeader = $(this).siblings('p').text();
	console.log(todoHeader);
			$.ajax({
		    url: '/todos',
		    type: 'DELETE',
		    success:  deleteCallback(),
		    data: {'header': todoHeader},
		    dataType: 'application/json'
		  });

			//delete from global array
			todos.splice(todos.indexOf(todoHeader),1);
});


function checkForDuplicity(header){
	
};
