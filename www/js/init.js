document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	try {
		window.plugins.webviewcolor.change('#2280BA');
		StatusBar.hide();
	} catch (e) {}
	
	getData();
}

/* Initialize canvas */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;
canvas.style.width = window.innerWidth;
canvas.style.height = window.innerHeight;
ctx.scale(2, 2);

ctx.shadowBlur = 7;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;


var canvas_bg = document.getElementById("canvas_bg");
var ctx_bg = canvas_bg.getContext("2d");
ctx_bg.canvas.width = window.innerWidth;
ctx_bg.canvas.height = window.innerHeight;
ctx_bg.globalAlpha = 0.7;


var face_width = $("#face").width();
var expanded_face = face_width - 5;

/* Load face image */
var face = new Image();
face.src = "images/small_face.png";

var middle_y = 148;

/* Define bounds */
var bounds = {
	top_left_x: (canvas.width / 4) - 166,
	top_left_y: middle_y - 89,
	top_right_x: (canvas.width / 4) + 120,
	bottom_right_y: middle_y + 57
}

/* Define settings */
var settings = {
	illegal_size: 3,
	fade_dist: 20,
	max_people: 5000,
	max_faces: 75,
	click_factor: 7
}

/* Declare global variables */
var people = new Array();
var agents = new Array();
var faces = new Array();

var total_persecond = 0;
var total_perclick = 0;

var deported = 5100000000;
var lastDraw = 0;
var total = 0;

var videosWatched = 0;

var shopOpen = false;
var settingsOpen = false;

var alertShown = 0;

var news_left = 0;
var news = [
	"Donald Trump approval rating sitting at 35%.",
	"Americans wondering when Trump will make good on his promise to build the wall."
];
$("#news").html(news.join(" <img src='images/fox.png'> "));
var min_left = -$("#news").width() - 120;

var milestones = [
	50,
	300,
	1000
];

/* Declare functions */

/* Save progress every 5 seconds */
setInterval(saveData, 5000);

/* Save progress */
function saveData() {
	window.localStorage.setItem('data', JSON.stringify({
			deported: deported,
			total_persecond: total_persecond,
			total_perclick: total_perclick,
			videos_watched: videosWatched,
			closed: Date.now(),
			news: news,
			faces: faces,
			locs: locs,
			people: JSON.stringify(people),
			agents: JSON.stringify(agents),
			purchases: JSON.stringify(purchases)
		}));
}

/* Clear progress and reload page */
function clearData() {
	window.localStorage.clear();
	window.location.reload(true);
}

/* Retrieve the progress and add it to game */
getData();
function getData() {
	if (window.localStorage.getItem('data')) {
		var data = $.parseJSON(window.localStorage.getItem('data'));
		
		var secondsSinceLast = (Date.now() - data.closed) / 1000;
		var toAdd = (secondsSinceLast * data.total_persecond);
		console.log("Seconds since last: " + secondsSinceLast.toFixed(1) + " | Added: " + toAdd.toFixed(1));
		deported = data.deported + toAdd;
		$("#count").html(deported.toFixed(0));

		total_persecond = Math.round(data.total_persecond * 10) / 10;
		$("#persecond").html(total_persecond);

		total_perclick = Math.round(data.total_perclick * 10) / 10;
		$("#perclick").html(total_perclick);
		
		videosWatched = data.videos_watched;
		$("#vid-reward").html("+" + getProperRewardAmount());

		news = data.news;
		$("#news").html(news.join(" <img src='images/fox.png'> "));
		min_left = -$("#news").width() - 120;
		
		locs = data.locs;

		setTimeout(function () {
			var people_json = $.parseJSON(data.people);
			for (var i = 0; i < people_json.length; i++) {
				var person_data = people_json[i];
				var person = new Person({
						x: person_data.x,
						y: person_data.y
					});
				person = person.fromData(person_data);
				if (!doesIndexExist(people, person) && people.length < settings.max_people && (i % 5) == 0) {
					people.push(person);
				}
			}

			var agents_json = $.parseJSON(data.agents);
			for (var i = 0; i < agents_json.length; i++) {
				var agent_data = agents_json[i];
				var agent = new Agent(0);
				agent = agent.fromData(agent_data);
				if (!doesIndexExist(agents, agent)) {
					agents.push(agent);
				}
			}

			var purchases_json = $.parseJSON(data.purchases);
			for (var key in purchases_json) {
				var purchase_data = purchases_json[key];
				purchases[key].cost = purchase_data.cost;
				purchases[key].current = purchase_data.current;
				$("#" + key + "-cost").html(purchase_data.cost);
				$("#" + key + "-amount").html(purchase_data.current);
			}
			
			for (var i = 0; i < data.faces.length; i++) {
				var face_data = data.faces[i];
				var face = new FallingFace();
				face = face.fromData(face_data);
				if (!doesIndexExist(faces, face) && faces.length < settings.max_faces) {
					faces.push(face);
				}
			}
		}, 100);
	}
}

/* Check if an object exists in an array */
function doesIndexExist(array, object) {
	for (var i = 0; i < array.length; i++) {
		var a = array[i];
		if (a.x == object.x && a.y == object.y) {
			return true;
		}
	}
	return false;
}

/* Toggle the settings page */
function toggleSettings() {
	if (!settingsOpen) {
		$("#settings").show();
	} else {
		$("#settings").hide();
	}
	settingsOpen = !settingsOpen;
}

/* Reset the deport count */
function resetCount(){
	deported = 0;
	$("#count").html(deported.toFixed(0));
}

/* Add a new string to the news at the top of the page */
function updateNews(string) {
	if (news.length > 5) {
		news.splice(0, 1);
	}
	news.push(string);

	$("#news").html(news.join(" <img src='images/fox.png'> "));
	min_left = -$("#news").width() - 120;
}

// showAlert("Mexico has begun showing signs of aggression against the United States. Is war eminent?");
/* Show a news alert in the center of the screen */
function showAlert(message){
	$("#alert-message").html(message);
	$("#overlay").show();
	$("#alert").show();
	
	alertShown = Date.now();
}

/* Remove the alert from the screen */
function exitAlert(){
	if(canExitAlert()){
		$("#overlay").hide();
		$("#alert").hide();
		alertShown = 0;
	}
}

/* Check if the alert can be removed */
function canExitAlert(){
	return (Date.now() - alertShown > 1000);
}

/* Check if the alert is open */
function isAlertOpen(){
	return (alertShown != 0);
}

/* Capitalize the first letter of a string */
function capitalize(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

/* Get a number with commas */
function getNumberWithCommas(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* Get a random whole number in the range */
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Get a random float in the range */
function unroundedRand(min, max) {
	return (Math.random() * (max - min) + min);
}

/* Get the distance between two locations */
function distance(pos1, pos2) {
	return Math.sqrt(((pos1.x - pos2.x) * (pos1.x - pos2.x)) + ((pos1.y - pos2.y) * (pos1.y - pos2.y)));
}

function resize() {}