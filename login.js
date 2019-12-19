var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var path = require('path');
var fs = require('fs');

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

var users;

var app = express();

app.use(flash());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use('/auths', express.static(__dirname + '/Users/vladislavdevlikamov/Desktop/ll/nodelogin/index-bg.jpg'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('/Users/vladislavdevlikamov/Desktop/ll/nodelogin'));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

app.get('/sign', function(request, response) {
	response.sendFile(path.join(__dirname + '/date.html'));
});

app.get('/record', function(request, response) {
	response.sendFile(path.join(__dirname + '/main.html'));
});

const jsonParser = express.json();


app.post("/auth", function(request, response) {
	console.log(request.session.loggedin);
	var username = request.body.username;
	var phone = request.body.phone;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ? AND phone = ?', [username, password, phone], function(error, results, fields) {
			if (results.length > 0) {	
				request.session.loggedin = true;
				request.session.username = username;
				request.session.phone = phone;
				response.send({text: "Welcome back"});
			} else {
				response.send({text: "Incorect username or password"});
			}			
			response.end();
		});
	} else{
		response.send({text: 'Please enter Username and Password!'});
		response.end();
	}
});

app.post("/auth2", function(request, response) {
	response.redirect('/');
});

app.post("/auth6", function(request, response) {
	response.redirect('/');
});

app.post("/auth1", function(request, response) {
	console.log(11);
	var username = request.body.username;
	var password = request.body.password;
	var email = request.body.email;
	var phone = request.body.phone;
	connection.query('INSERT INTO accounts (username, password, email, phone) VALUES (?, ?, ?, ?)', [username, password, email, phone]);
	response.send({text: 'Welcome'});
});

var dates;
var vid;

app.post("/auth3", function(request, response) {
	response.redirect('/sign');
});

app.post("/sign4", function(request, response) {
	response.redirect('/');
});

app.post("/sign", function(request, response) {
	response.setHeader('content-type', 'text/plain');
	vid = request.body.values; 
	console.log(request.body);
 	var date = request.body.date;
 	vid = request.body.vid;
	var string = date.split("-");
	dates = string[0] + '-' + string[1] + '-' + string[2];
	connection.query("Select * FROM nodelogin.booking WHERE date = ? ORDER BY start_time", [dates], function(error, result, fields) {
		var str = JSON.stringify(result, null, 2);
		fs.writeFileSync('/Users/vladislavdevlikamov/Desktop/ll/nodelogin/rankings.json', str);
	});
	response.json(dates);
});

app.post("/exit",function(request, response)  {
	console.log(request.session.loggedin);
	request.session.loggedin = false;
	response.redirect('/');
});

var time;
app.post("/sign1", function(request, response) {
	console.log(1);
	time = request.body.time;
	var string = time.split(":");
	let y;
	let x = Number(string[0])*60 + Number(string[1]);
	if (vid == "Стрижка") y = x + 60;
	if (vid == "Мелирование") y = x + 90;
	if (vid == "Окрашивание") y = x + 90;
	if (vid == "Укладка") y = x + 30;
	if (vid == "Массаж головы") y = x + 60;
	if (vid == "Лечение волос") y = x + 60;
	if (vid == "Ламинирование") y = x + 90;
	if (vid == "Наращивание волос") y = x + 120;
	if (vid == "Плетение кос") y = x + 60;
	if (vid == "Декапирование") y = x + 90;
	if (vid == "Предпигментация") y = x + 90;
	let k = Math.floor(Number(y/60));
	let kk = Math.floor(Number(k/10));
	var end_time = '';
	if (kk == 0) end_time += '0';
 	end_time += (k).toString();
	end_time += ":";
	let k1 = Number(y % 60);
	let kk1 = Math.floor(Number(k1/10));
	if (kk1 == 0) end_time += '0';
	end_time += (k1).toString();
	connection.query("Select * FROM nodelogin.booking WHERE date = ? AND ((start_time <= ? AND end_time >= ?) || (start_time <= ? AND end_time >= ?))  ORDER BY start_time" , [dates, time, time, end_time, end_time], function(error, result, fields) {
		if (result.length > 0) response.send({text: "This time is busy"});
		else {
			if (request.session.loggedin == false) {
				var string = time.split(":");
				let y;
				let x = Number(string[0])*60 + Number(string[1]);
				if (vid == "Стрижка") y = x + 60;
				if (vid == "Мелирование") y = x + 90;
				if (vid == "Окрашивание") y = x + 90;
				if (vid == "Укладка") y = x + 30;
				if (vid == "Массаж головы") y = x + 60;
				if (vid == "Лечение волос") y = x + 60;
				if (vid == "Ламинирование") y = x + 90;
				if (vid == "Наращивание волос") y = x + 120;
				if (vid == "Плетение кос") y = x + 60;
				if (vid == "Декапирование") y = x + 90;
				if (vid == "Предпигментация") y = x + 90;
				if (x >= 480 && y < 820) {
					response.send({text: "GO"});
				}
				else {
					response.send({text: "Incorect time"});
				}
			}
			else {
				console.log(2);
				var username = request.session.username;
				var phone = request.session.phone;
				var string = time.split(":");
				if (typeof username == "undefined" || typeof phone == "undefined") {
					var string = time.split(":");
					let y;
					let x = Number(string[0])*60 + Number(string[1]);
					if (vid == "Стрижка") y = x + 60;
					if (vid == "Мелирование") y = x + 90;
					if (vid == "Окрашивание") y = x + 90;
					if (vid == "Укладка") y = x + 30;
					if (vid == "Массаж головы") y = x + 60;
					if (vid == "Лечение волос") y = x + 60;
					if (vid == "Ламинирование") y = x + 90;
					if (vid == "Наращивание волос") y = x + 120;
					if (vid == "Плетение кос") y = x + 60;
					if (vid == "Декапирование") y = x + 90;
					if (vid == "Предпигментация") y = x + 90;
					if (x >= 480 && y < 820) {
						response.send({text: "GO"});
					}
					else {
						response.send({text:"Incorect time"});
					}
				} else {
					var string = time.split(":");
					let y;
					let x = Number(string[0])*60 + Number(string[1]);
					if (vid == "Стрижка") y = x + 60;
					if (vid == "Мелирование") y = x + 90;
					if (vid == "Окрашивание") y = x + 90;
					if (vid == "Укладка") y = x + 30;
					if (vid == "Массаж головы") y = x + 60;
					if (vid == "Лечение волос") y = x + 60;
					if (vid == "Ламинирование") y = x + 90;
					if (vid == "Наращивание волос") y = x + 120;
					if (vid == "Плетение кос") y = x + 60;
					if (vid == "Декапирование") y = x + 90;
					if (vid == "Предпигментация") y = x + 90;
					if (x >= 480 && y < 820) { 
						let k = Math.floor(Number(y/60));
						let kk = Math.floor(Number(k/10));
						var end_time = '';
						if (kk == 0) end_time += '0';
				 		end_time += (k).toString();
						end_time += ":";
						let k1 = Number(y % 60);
						let kk1 = Math.floor(Number(k1/10));
						if (kk1 == 0) end_time += '0';
						end_time += (k1).toString();
						connection.query('INSERT INTO nodelogin.booking (name, type, date, start_time, end_time, phone_number) VALUES (?, ?, ?, ?, ?, ?)', [username, vid, dates, time, end_time, phone]);
						response.send({text: 'Succesful'});
					}
					else {
						response.send({text: "Incorect time"});
					}
				}
			}
		}
	});
});

app.post("/record", function(request, response) {
	var username = request.body.username;
	var phone = request.body.number;
	var string = time.split(":");
	var string = time.split(":");
	let y;
	let x = Number(string[0])*60 + Number(string[1]);
	if (vid == "Стрижка") y = x + 60;
	if (vid == "Мелирование") y = x + 90;
	if (vid == "Окрашивание") y = x + 90;
	if (vid == "Укладка") y = x + 30;
	if (vid == "Массаж головы") y = x + 60;
	if (vid == "Лечение волос") y = x + 60;
	if (vid == "Ламинирование") y = x + 90;
	if (vid == "Наращивание волос") y = x + 120;
	if (vid == "Плетение кос") y = x + 60;
	if (vid == "Декапирование") y = x + 90;
	if (vid == "Предпигментация") y = x + 90;
	if (x >= 480 && y < 820) { 
		let k = Math.floor(Number(y/60));
		let kk = Math.floor(Number(k/10));
		var end_time = '';
		if (kk == 0) end_time += '0';
		end_time += (k).toString();
		end_time += ":";
		let k1 = Number(y % 60);
		let kk1 = Math.floor(Number(k1/10));
		if (kk1 == 0) end_time += '0';
		end_time += (k1).toString();
		connection.query('INSERT INTO nodelogin.booking (name, type, date, start_time, end_time, phone_number) VALUES (?, ?, ?, ?, ?, ?)', [username, vid, dates, time, end_time, phone]);
		response.send({text: 'Succesful'});
	}
	else {
		response.send({text: "Incorect time"});
	}
});

app.listen(3000);