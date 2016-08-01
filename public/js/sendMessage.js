var messageBoard = 'main-chat';
var username;
var pendingChat;
var flashInterval = {};

$(document).ready(function() {
	$('#sendMessage').click(function() {
		sendMessage();
	});
	
	showLoggedInto();
	
	getMessages();
	getUsers();
	setInterval(scrollToBottom, 200);
	setInterval(getMessages, 2000);
	setInterval(getUsers, 5000);
	setInterval(getPrivateChats, 5000);
});

function showLoggedInto() {
	$.ajax({
		url: "/getUsername",
		type: "POST"
	}).done(function(name) {
		username = name.name;
		$('.label').append(" <div>Username: " + name.name + "</div>");
	});
}

function scrollToBottom() {
	$(".message-board").animate({
		scrollTop: $('#' + messageBoard).height()
	}, 1000);
}

function sendMessage() {
	var message = $('.user-text').val();

	if (message.trim() != "") {
		$.ajax({
			url: '/sendMessage?message=' + message + "&messageboard=" + messageBoard,
			type: "POST"
		}).done(function(message) {
			var date = new Date();
			var msgTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			var text = "<div class='text-container'><div class='name' style='color: " + message.usercolor + "'><span style='font-size: 9px;'>" 
				+ msgTime + "</span> " + message.username + ":</div><div class='text'>" + message.text + "</div></div>";
			$('#' + messageBoard).append(text);
			$('.user-text').val('');
		});
	}
}

function getMessages() {
	$.ajax({
		url: '/getMessages',
		type: "GET"
	}).done(function(messages) {
		messages.forEach(function(message) {
			var date = new Date();
			var msgTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			var text = "<div class='text-container'><div class='name-grabbed' style='color: " 
				+ message.usercolor + "'><span style='font-size: 9px;'>" + msgTime + "</span> " + message.username + ":</div><div class='text'>" 
				+ message.text + "</div></div>";
			
			if (message.messageboard != "main-chat")
				$('#' + message.username + "-chat").append(text);
			else
				$('#main-chat').append(text);
			
			if (messageBoard != message.messageboard && message.messageboard != 'main-chat') {
				var pcName = message.username + '-a';
				console.log('pcName: ' + pcName);
				$('#' + pcName ).addClass('flash');
				pendingChat = pcName;
				flashInterval[pcName] = setInterval(toggleFlash, 1000);
			}
			else {
				var pcName = message.messageboard.split('-')[0] + '-a';
				
				$('#' + pcName ).addClass('flash');
				pendingChat = pcName;
				flashInterval[pcName] = setInterval(toggleFlash, 1000);
			}
		});
	});
}

function toggleFlash() {
	$('.flash').toggle();
}

function getUsers() {
	$.ajax({
		url: '/getUsers',
		type: "GET"
	}).done(function(users) {
		$('#users').html("<div class='users-label'>Online:</div>");
		users.forEach(function(user) {
			$('#users').append("<li class='user'><a onclick='createPrivateChat(\"" + user.username + 
				"\")' class='a-user' style='color: " + user.usercolor + "' title='Chat privately with: " 
				+ user.username + "'>" + user.username + "</a></li>");
		});
	});
}

function createPrivateChat(name) {
	$.ajax({
		url: '/createPrivateChat?username=' + name,
		type: "POST"
	}).done(function(resp) {
		if (resp.created === true) {
			$('#tabs').append("<li><a href='#" + name + "' data-toggle='tab' onclick=\"changeChat('" + name + "-chat')\">" + name + "</a></li>");
			$('.tab-content').append("<div id='" + name + "' class='tab-pane fade'>" 
					+ "<div class='message-board' id='" + name + "-chat'>" 
					+ "</div>" 
				+ "</div>");
			changeChat(name);
		}
		else {
			alert('User ' + name + 'is not active.');
		}
	});
}

function getPrivateChats() {
	$.ajax({
		url: '/getPrivateChats',
		type: "GET"
	}).done(function(messageboards) {
		if (messageboards.length > 0) {
			messageboards.forEach(function(name) {
				$('#tabs').append("<li><a href='#" + name + "' data-toggle='tab' onclick=\"changeChat('" + name + "-chat')\">" + name + "</a></li>");
				$('.tab-content').append("<div id='" + name + "' class='tab-pane fade'>" 
						+ "<div class='message-board' id='" + name + "-chat'>" 
						+ "</div>" 
					+ "</div>");
			});
			
			if ($('.user-text').val().length == 0)
				messageBoard = name + "-chat";
		}
	});
}

function changeChat(chat) {
	console.log("chat: " + chat);
	if (pendingChat && (chat == pendingChat)) {
		$('#' + pendingChat).removeClass('flash');
		clearInterval(flashInterval[pendingChat]);
	}
		
	messageBoard = chat;
	console.log(messageBoard);
}
