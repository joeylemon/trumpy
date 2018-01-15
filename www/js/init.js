var admobid = {
	banner: 'ca-app-pub-3849622190274333/9972053558',
	interstitial: 'ca-app-pub-3849622190274333/4913978629'
};
var lastInterstitial = 0;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	try {
		window.plugins.webviewcolor.change('#2280BA');
		StatusBar.hide();
		
		if(AdMob){
			AdMob.setOptions({
				overlap: true,
				position: AdMob.AD_POSITION.BOTTOM_CENTER,
				autoShow: true,
				isTesting: true
			});
			AdMob.createBanner({
				adId: admobid.banner,
				autoShow: true
			});
			slideout.on('open', function() {
				if(canDisplayInterstitial()){
					AdMob.prepareInterstitial({
						adId: admobid.interstitial,
						autoShow: true
					});
					lastInterstitial = Date.now();
				}
			});
			
			$("#count-div").css({bottom: "55px"});
			$("#shop-img").css({bottom: "56px"});
			$("#face-div").css({bottom: "110px"});
			$("#face").css({width: "165px"});
			face_width = $("#face").width();
			expanded_face = face_width - 5;
		}
	} catch (e) {}
}

function canDisplayInterstitial(){
	return (Date.now() - lastInterstitial > 45000) && Math.random() <= 0.4;
}

/* Initialize canvas */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var canvas_bg = document.getElementById("canvas_bg");
var ctx_bg = canvas_bg.getContext("2d");
ctx_bg.canvas.width  = window.innerWidth;
ctx_bg.canvas.height = window.innerHeight;

var face_width = $("#face").width();
var expanded_face = face_width - 5;

/* Load face image */
var face = new Image();
face.src = "images/small_face.png";

var middle_y = 148;

/* Define bounds */
var bounds = {
	top_left_x: (canvas.width / 2) - 166,
	top_left_y: middle_y - 89,
	top_right_x: (canvas.width / 2) + 120,
	bottom_right_y: middle_y + 57
}

var borderLocs = [
	{x: (canvas.width / 2) - 123, y: middle_y + 56},
	{x: (canvas.width / 2) - 104, y: middle_y + 54},
	{x: (canvas.width / 2) - 79, y: middle_y + 58},
	{x: (canvas.width / 2) - 60, y: middle_y + 78},
	{x: (canvas.width / 2) - 39, y: middle_y + 73},
	{x: (canvas.width / 2) - 30, y: middle_y + 93}
];

/* Define settings */
var settings = {
	illegal_size: 3,
	fade_dist: 20
}

/* Declare global variables */
var people = new Array();
var agents = new Array();
var faces = new Array();

var total_persecond = 0;
var total_perclick = 0;

var deported = 0;
var lastDraw = 0;
var total = 0;

var shopOpen = false;

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

var purchases = {
	republican: 		new Purchase('republican', 10, 'agent', {delay: 1000 / 0.2, color: '#A20000', size: settings.illegal_size + 2}),
	click_multiplier: 	new Purchase('click_multiplier', 20, 'upgrade', {rate: .10}),
	agent: 				new Purchase('agent', 100, 'agent', {delay: 1000 / 1, color: '#000', size: settings.illegal_size + 4}),
	wall: 				new Purchase('wall', 1100, 'agent', {delay: 1000 / 8, color: '#DD8500', size: settings.illegal_size + 6}),
	executive_order: 	new Purchase('executive_order', 13000, 'agent', {delay: 1000 / 45, color: '#787878', size: settings.illegal_size + 6}),
	state_law: 			new Purchase('state_law', 140000, 'agent', {delay: 1000 / 260, color: '#21C800', size: settings.illegal_size + 9})
};

/* Set up page */
initShop();
function initShop(){
	for(var key in purchases){
		var item = purchases[key];
		var details = item.getDetails();
		$("#shop").append(getPurchaseHTML(details));
	}
}

function getPurchaseHTML(details){
	return `
		<div class="shop-item" id="` + details.id + `" ontouchstart="attemptBuy(event, '` + details.id + `')" ontouchend="buy(event, '` + details.id + `')">
			<img src="` + details.image + `">
			<div class="desc" id="` + details.id + `-desc">
				<p class="name">` + details.title + `</p>
				<p class="more">` + details.desc + `</p>
				<p class="more">Cost: <span id="` + details.id + `-cost">` + details.cost + `</span></p>
			</div>
			<div class="amount">
				<p id="` + details.id + `-amount">` + details.amount + `</p>
			</div>
		</div>
	`;
}

updateObscuredItems();

/* Declare functions */
function updateObscuredItems(){
	for(var key in purchases){
		var item = purchases[key];
		if(deported < item.cost){
			$("#" + key).css("opacity", "0.3");
		}else{
			$("#" + key).css("opacity", "1");
		}
	}
}

function updateItemCosts(){
	for(var key in purchases){
		var item = purchases[key];
		$("#" + key + "-cost").html(item.getDetails().cost);
	}
}

function updateNews(string){
	if(news.length > 5){
		news.splice(0, 1);
	}
	news.push(string);
	
	$("#news").html(news.join(" <img src='images/fox.png'> "));
	min_left = -$("#news").width() - 120;
}

function capitalize(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getNumberWithCommas(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function unroundedRand(min, max){
	return (Math.random() * (max - min) + min);
}

function distance(pos1, pos2){
	return Math.sqrt( ((pos1.x - pos2.x) * (pos1.x - pos2.x)) + ((pos1.y - pos2.y) * (pos1.y - pos2.y)) );
}

function resize(){
	
}

document.onmousedown = function(event){
	var x = event.offsetX;
	var y = event.offsetY;
	console.log(x + ", " + y);
	
	var plus_x = (canvas.width / 2) - x;
	var plus_y = middle_y - y;
	console.log("(canvas.width / 2)" + (plus_x > 0 ? " - " : " + ") + Math.abs(plus_x));
	console.log("middle_y" + (plus_y > 0 ? " - " : " + ") + Math.abs(plus_y));
}