// JavaScript Document
var apiUrl = 'https://www.fsi.illinois.edu/demo/data.cfm';
var apiKey = '37a99194b94b2c1aeae3cd3b30ab7b9b';
$(document).ready(function() {
	getTasks();
	
	$('#toggle-new-task-btn').click(function(e){
		$('#new-task-holder').toggle();
		if($('#toggle-new-task-btn').hasClass('btn-primary')){
			$('#toggle-new-task-btn').removeClass('btn-primary');
			$('#toggle-new-task-btn').addClass('btn-success');
			$('#task-description').focus();
		}else{
			$('#toggle-new-task-btn').removeClass('btn-success');
			$('#toggle-new-task-btn').addClass('btn-primary');
		}
	});
	  
	$('#add-task-btn').click(function(e){
		var taskDesc = $('#task-description').val();
		var taskDate = $('#task-due-date').val();
		var taskComplete = 0;
		if($('#task-complete').is(':checked')){
			taskComplete = 1;
		}
		createTask(taskDesc,taskDate,taskComplete);
	});
	
	$('#edit-task-btn').click(function(e){
		var taskId = $('#current-task').val();
		var taskDesc = $('#task-description').val();
		var taskDate = $('#task-due-date').val();
		var taskComplete = 0;
		if($('#task-complete').is(':checked')){
			taskComplete = 1;
		}
		updateTask(taskId, taskDesc,taskDate,taskComplete);
	});
	
	$(document).on('click','.btn-edit',function(){
		var e = $(this);
		var ele = e.attr('id');
		var eleArray = ele.split('_');
		var act = eleArray[0];
		var taskId = eleArray[1];
		if(act == 'edit-task'){
			console.log(e.parent().siblings('.task-desc'));
			$('#current-task').val(taskId);
			$('#task-description').val(e.parent().siblings('.task-desc').html());
			var dueDateObj = new Date(e.parent().siblings('.task-date').html());
			var mm = dueDateObj.getMonth();
			var dd = dueDateObj.getDate();
			var dueDate = dueDateObj.getFullYear() + '-' + (mm < 10 ? '0' : '') + mm + '-' + (dd < 10 ? '0' : '') + dd;
			$('#task-due-date').val(dueDate);
			var taskComplete = 0;
			if($('#task-complete').is(':checked')){
				taskComplete = 1;
			}
			$('#new-task-holder, #edit-task-btn').show();
			$('#add-task-btn, #toggle-new-task-btn').hide();
			//updateTask(taskId,taskDesc,taskDate,taskComplete);
		}else{
			deleteTasks(taskId);
			//getTasks();
		}
	});
		
});

function turnOffAlert(){
setTimeout(function() {
		$("div[role='alert']").fadeOut('slow');
	}, 2000);
}

function updateTaskView(d)
{
	var curTable = $('#current-tasks-table tbody');
	var comTable = $('#completed-tasks-table tbody');
	curTable.html('');
	comTable.html('');
 	$.each(d, function(i, item){
		var row = $('<tr></tr>');
		var descCell = $('<td></td>',{'class':'task-desc'});
		var dateCell = $('<td></td>',{'class':'task-date'});
		var editCell = $('<td></td>');
		var editBtn = $('<button></button>',{id:'edit-task_' + d[i].task_id, 'class': 'btn btn-secondary btn-sm btn-edit'}).html('Edit');
		editCell.append(editBtn);
		var deleteCell = $('<td></td>');
		var deleteBtn = $('<button></button>',{id:'delete-task_' + d[i].task_id, 'class': 'btn btn-danger btn-sm btn-edit'}).html('Delete');
		deleteCell.append(deleteBtn);
		descCell.html(d[i].task_description);
		dateCell.html(d[i].due_date);
		row.append(descCell);
		row.append(dateCell);
		row.append(editCell);
		row.append(deleteCell);
		if(d[i].completed == 0){
			curTable.append(row);			
		}else{
			comTable.append(row);
		}
	});
}

function sendRequest(sendInfo)
{
	var send = JSON.stringify(sendInfo);
	var obj = $.parseJSON(send);
	var action = obj.action;
	$.ajax({
		type: 'POST',
		url: apiUrl,
		dataType: 'json',
		contentType: 'application/json',
		data: send,	
		success: function(result){
			if(action == 'getTasks'){
				updateTaskView(result);
			}else{
				$('#alert-text').html('<strong>Success!</strong>');
				$('#status-alert').show();
				$('.alert').show();
				turnOffAlert();
				$('#task-description').val('');
				$('#task-due-date').val('');
				$('#new-task-holder').hide();
				$('#edit-task-btn').hide();
				$('#toggle-new-task-btn').removeClass('btn-success');
				$('#toggle-new-task-btn').addClass('btn-primary');
				$('#add-task-btn, #toggle-new-task-btn').show();
				getTasks();
			}
		},
		error:function(result){
			console.log(result);
			console.log(result.statusText);
			if(result.status == 200){
				$('#alert-text').html('<strong>Success!</strong>');
				$('#status-alert').show();
				$('.alert').show();
				turnOffAlert();
				$('#task-description').val('');
				$('#task-due-date').val('');
				$('#new-task-holder').hide();
				$('#edit-task-btn').hide();
				$('#toggle-new-task-btn').removeClass('btn-success');
				$('#toggle-new-task-btn').addClass('btn-primary');
				$('#add-task-btn, #toggle-new-task-btn').show();
			}
			getTasks();
		}
	})
}

function createTask(desc, date, complete)
{
	var sendInfo = {
			action: 'createTask',
			task_description: desc,
			due_date: date,
			completed : complete,
			apiKey: apiKey
		};
	sendRequest(sendInfo);
}

function updateTask(taskId, desc, date, complete)
{
	var sendInfo = {
			action: 'updateTask',
			task_description: desc,
			due_date: date,
			completed : complete,
			task_id: taskId,
			apiKey: apiKey
		};
	sendRequest(sendInfo);
}

function getTasks()
{
	var sendInfo = {action: 'getTasks', apiKey: apiKey};
	sendRequest(sendInfo);
}

function deleteTasks(taskId)
{
	var sendInfo = {action: 'deleteTask', task_id: taskId, apiKey: apiKey};
	sendRequest(sendInfo);
}