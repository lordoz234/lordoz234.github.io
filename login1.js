var mysql = require('mysql');
var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

connection.connect((err) => {
	if (!err) {
		console.log("succeded");
	}
});

var app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post("/auth", function(request, response) {
	var username = request.body.username;
});

app.listen(3000);