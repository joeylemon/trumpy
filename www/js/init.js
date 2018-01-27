document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	try {
		window.plugins.webviewcolor.change('#2280BA');
		StatusBar.hide();
	} catch (e) {}
	
	getData();
}

slideout.on('close', function () {
	if (settingsOpen) {
		toggleSettings();
	}
});

var size = window.innerHeight * 1.5;
$("#rays").css({width: size + "px", height: size + "px", margin: "-" + (size / 2) + "px 0 0 -" + (size / 2) + "px"});

setTimeout(function(){
	$("body").css({backgroundColor: "#fff"});
	$("#shop-hide").show();
}, 100);

/* Initialize person canvas */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;
canvas.style.width = window.innerWidth;
canvas.style.height = window.innerHeight;
ctx.scale(2, 2);

/* Initialize agent canvas */
var canvas_agents = document.getElementById("canvas_agents");
var ctx_agents = canvas_agents.getContext("2d");
canvas_agents.width = window.innerWidth * 2;
canvas_agents.height = window.innerHeight * 2;
canvas_agents.style.width = window.innerWidth;
canvas_agents.style.height = window.innerHeight;
ctx_agents.scale(2, 2);

ctx_agents.shadowBlur = 7;
ctx_agents.shadowOffsetX = 2;
ctx_agents.shadowOffsetY = 2;
ctx_agents.shadowColor = 'rgba(0, 0, 0, 0.5)';

/* Initialize face canvas */
var canvas_bg = document.getElementById("canvas_bg");
var ctx_bg = canvas_bg.getContext("2d");
ctx_bg.canvas.width = window.innerWidth;
ctx_bg.canvas.height = window.innerHeight;
ctx_bg.globalAlpha = 0.7;


var face_width = $("#face").width();
var expanded_face = face_width - 5;
var face_bottom = $("#face-div").css("bottom");

/* Load face image */
var face = new Image();
face.src = "images/small_face.png";

/* Define settings */
var settings = {
	illegal_size: 3,
	fade_dist: 10,
	max_people: 1000,
	max_faces: 75,
	click_factor: 7,
	shorten_min: 10000,
	counts_shorten_min: 10000
}

/* Declare global variables */
var people = new Array();
var agents = new Array();
var faces = new Array();

var people_to_remove = new Array();
var faces_to_remove = new Array();

var total_persecond = 0;
var total_perclick = 0;

var deported = 0;
var videosWatched = 0;
var alertShown = 0;
var lastRemove = 0;
var middle_y = 148;
var lastId = 0;
var total = 0;

var shopOpen = false;
var settingsOpen = false;
var gamePaused = false;

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
			borders: borders,
			faces: faces,
			locs: locs,
			lastId: lastId,
			people: JSON.stringify(people),
			agents: JSON.stringify(agents),
			purchases: JSON.stringify(purchases)
		}));
}

/* Clear progress and reload page */
function clearData() {
	window.localStorage.clear();
	window.location.reload(true);
	if(admob){
		admob.banner.hide();
	}
}

/* Retrieve the progress and add it to game */
getData();
function getData() {
	if (window.localStorage.getItem('data')) {
		var data = $.parseJSON(window.localStorage.getItem('data'));
		
		deported = data.deported;

		total_persecond = data.total_persecond;
		total_perclick = data.total_perclick;
		updateCounts();
		
		addToTotalSinceTime(data.closed);
		
		videosWatched = data.videos_watched;
		$("#vid-reward").html("+" + getProperRewardAmount());

		news = data.news;
		$("#news").html(news.join(" <img src='images/fox.png'> "));
		min_left = -$("#news").width() - 120;
		
		lastId = data.lastId;

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
			updateAgentCanvas();

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
			
			locs = data.locs;
		
			borders = data.borders;
		}, 100);
	}
}

/* Add to the total based on a timestamp */
function addToTotalSinceTime(closed){
	var secondsSinceLast = (Date.now() - closed) / 1000;
	var toAdd = (secondsSinceLast * total_persecond);
	if(toAdd > 1){
		deported += toAdd;
		$("#count").html(deported.toFixed(0));
		showAdded(toAdd);
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

var temp = {closed: 0};
document.addEventListener("pause", paused, false);
document.addEventListener("resume", resumed, false);

/* Detect when the app is moved to the background */
function paused() {
	temp.closed = Date.now();
	gamePaused = true;
}

/* Detect when the app is back in the foreground */
function resumed() {
	addToTotalSinceTime(temp.closed);
	gamePaused = false;
}

/* Toggle the game paused boolean */
function togglePaused() {
	gamePaused = !gamePaused;
}

/* Display an animate the amount added after starting app */
function showAdded(added) {
	$("#added").html("+" + getShortenedNumber(added));
	$("#added").show();
	
	$("#added").addClass("added-animate");
	setTimeout(function(){
		$("#added").hide();
		$("#added").removeClass("added-animate");
	}, 3000);
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
function setCount(num){
	deported = num;
	$("#count").html(deported.toFixed(0));
}

setTimeout(updateCounts, 0);
/* Update the counts at the bottom of the screen */
function updateCounts(){
	$("#pers").css({fontSize: "15px"});
	
	var persecond;
	if(total_persecond > settings.counts_shorten_min){
		persecond = getShortenedNumber(total_persecond);
	}else{
		persecond = getNumberWithCommas(roundNumber(total_persecond));
	}
	$("#persecond").html(persecond);
	
	var perclick;
	if(total_perclick > settings.counts_shorten_min){
		perclick = getShortenedNumber(total_perclick);
	}else{
		perclick = getNumberWithCommas(roundNumber(total_perclick));
	}
	$("#perclick").html(perclick);
	
	if($("#pers").width() > 305){
		$("#pers").css({fontSize: "12.5px"});
	}
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

var colors = [
	"132, 92, 0",
	"139, 69, 19",
	"205, 133, 63",
	"244, 164, 96",
	"160, 82, 45"
];
/* Get a random color from the array */
function getRandomColor(){
	return colors[rand(0, colors.length - 1)];
}

/* Get the next id */
function getNextID(){
	lastId++;
	if(lastId > 100000){
		lastId = 0;
	}
	return lastId;
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

/* Round a number to the tenth */
function roundNumber(num){
	return Math.round(num * 10) / 10;
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