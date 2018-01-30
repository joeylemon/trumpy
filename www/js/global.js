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
	person_size: 3.25,
	fade_dist: 10,
	max_people: 1500,
	max_faces: 75,
	click_factor: 7,
	shorten_min: 10000
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