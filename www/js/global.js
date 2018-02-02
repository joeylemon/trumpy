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
var detention_centers = 0;
var videosWatched = 0;
var alertShown = 0;
var lastRemove = 0;
var middle_y = 148;
var lastId = 0;
var total = 0;

var shopOpen = false;
var settingsOpen = false;
var gamePaused = false;
var showFakeAd = true;

var news_left = 0;
var news = [
	"Donald Trump approval rating sitting at 35%.",
	"Americans wondering when Trump will make good on his promise to build the wall."
];
joinNews();

/* Join the news array and display it at the top of the screen */
function joinNews(){
    $("#news").html(news.join(" <img src='images/fox.png'> "));
	min_left = -$("#news").width() - 120;
}

var illegals_entering = [
    {msg: "A hole in the wall has caused a huge spike of illegals re-entering the country. Beat them before they overrun you!", min_clicks: 200},
    {msg: "A recent law has decreased the amount of patrol agents at the border. Stop the illegals from entering!", min_clicks: 400},
    {msg: "A massive tunnel has been dug under the wall. Send the illegal immigrants back as fast as you can!", min_clicks: 500},
    {msg: "A bureaucratic oversight has temporarily allowed illegal immigrants to enter the country freely. Stop them!", min_clicks: 600}
];
var illegals_entering_index = 0;
var illegals_entering_delay = 0;
var clicks = 0;
var last_illegal_enter = Date.now();

var milestones = [
	50,
	300,
	1000
];

var detention_center_prices = [
    1000,
    100000,
    10000000,
    500000000,
    100000000000,
    10000000000000,
];

var default_purchases = {
	tap_multiplier: new Purchase('tap_multiplier', 20, 'upgrade', {
		desc: "Increases the amount of illegal immigrants you deport every time you tap the screen.",
		rate: .10
	}),
	detention_center: new Purchase('detention_center', 1000, 'center', {
		desc: "Collects illegal immigrants when you're not playing. Buy more to increase capacity.",
		hours: 0.5
	}),
	republican: new Purchase('republican', 10, 'agent', {
		desc: "A trustworthy constituent just trying to do his part.",
		delay: 1000 / 0.2,
		size: 15
	}),
	ice_agent: new Purchase('ice_agent', 100, 'agent', {
		desc: "A ruthless agent of the U.S. Immigration and Customs Enforcement agency.",
		delay: 1000 / 1,
		size: 18
	}),
	border_agent: new Purchase('border_agent', 1100, 'agent', {
		desc: "A well-trained soldier ordered to protect the borders at all costs.",
		delay: 1000 / 8,
		size: 20,
		max: 2
	}),
	wall: new Purchase('wall', 13000, 'agent', {
		desc: "A 35-foot high portion of the massive wall protecting the southern border.",
		delay: 1000 / 45,
		size: 9,
		max: 6
	}),
	executive_order: new Purchase('executive_order', 140000, 'agent', {
		desc: "An executive order passed by President Trump himself.",
		delay: 1000 / 260,
		size: 22,
		max: 30
	}),
	local_law: new Purchase('local_law', 1500000, 'agent', {
		desc: "A county-level law allowing its citizens to manually deport illegal immigrants.",
		delay: 1000 / 1400,
		size: 22,
		max: 100
	}),
	state_law: new Purchase('state_law', 20000000, 'agent', {
		desc: "A state-wide law allowing its citizens to manually deport illegal immigrants.",
		delay: 1000 / 7800,
		size: 20,
		max: 400
	}),
	federal_law: new Purchase('federal_law', 330000000, 'agent', {
		desc: "A nation-wide law allowing all citizens to manually deport illegal immigrants.",
		delay: 1000 / 44000,
		size: 25,
		max: 3000
	}),
	amendment: new Purchase('amendment', 5100000000, 'agent', {
		desc: "An amendment to the Constitution itself. Approved by Congress and all states.",
		delay: 1000 / 260000,
		size: 28,
		max: 10000
	}),
	national_guard: new Purchase('national_guard', 75000000000, 'agent', {
		desc: "The deployment of the national guard to raid private property and find illegals.",
		delay: 1000 / 1600000,
		size: 28,
		max: 70000
	}),
	martial_law: new Purchase('martial_law', 1000000000000, 'agent', {
		desc: "The last straw of the U.S. government: declare martial law and get every last illegal out.",
		delay: 1000 / 10000000,
		size: 28,
		max: 250000
	})
};
var purchases = default_purchases;