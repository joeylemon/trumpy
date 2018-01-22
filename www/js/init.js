var admobid = {
	banner: 'ca-app-pub-3849622190274333/9972053558',
	interstitial: 'ca-app-pub-3849622190274333/4913978629',
	reward_video: 'ca-app-pub-3849622190274333/6461087910'
};
var lastInterstitial = 0;
var shown = false;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	try {
		window.plugins.webviewcolor.change('#2280BA');
		StatusBar.hide();

		admob.setOptions({
			publisherId: admobid.banner,
			overlap: true,
			isTesting: true
		});

		admob.banner.config({
			id: admobid.banner,
			autoShow: true
		});
		admob.banner.prepare();

		admob.interstitial.config({
			id: admobid.interstitial,
			autoShow: false
		});
		admob.interstitial.prepare();
		
		slideout.on('open', function () {
			if (canDisplayInterstitial()) {
				admob.interstitial.show();
				shown = true;
				lastInterstitial = Date.now();
			}
		});
		slideout.on('close', function () {
			if (shown) {
				admob.interstitial.config({
					id: admobid.interstitial,
					autoShow: false
				});
				admob.interstitial.prepare();
				
				shown = false;
			}
			if (settingsOpen) {
				toggleSettings();
			}
		});

		admob.rewardvideo.config({
			id: admobid.reward_video
		});
		admob.rewardvideo.prepare();
	} catch (e) {}
	getData();
}

function canDisplayInterstitial() {
	return (Date.now() - lastInterstitial > 75000) && Math.random() <= 0.4;
}

function watchRewardVideo() {
	admob.rewardvideo.show();
}

document.addEventListener('admob.rewardvideo.events.LOAD', function(event) {
	$("#reward").show();
});

document.addEventListener('admob.rewardvideo.events.START', function(event) {
	$("#reward").hide();
	setTimeout(function(){
		admob.rewardvideo.prepare();
	}, 45000);
});

document.addEventListener('admob.rewardvideo.events.REWARD', function(event) {
	deported += getRewardAmount();
	$("#count").html(deported.toFixed(0));
	
	videosWatched++;
	$("#vid-reward").html("+" + getProperRewardAmount());
});



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

var borderLocs = [{
		x: (canvas.width / 4) - 123,
		y: middle_y + 56
	}, {
		x: (canvas.width / 4) - 104,
		y: middle_y + 54
	}, {
		x: (canvas.width / 4) - 79,
		y: middle_y + 58
	}, {
		x: (canvas.width / 4) - 60,
		y: middle_y + 78
	}, {
		x: (canvas.width / 4) - 39,
		y: middle_y + 73
	}, {
		x: (canvas.width / 4) - 30,
		y: middle_y + 93
	}
];

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

// http://cookieclicker.wikia.com/wiki/Building
var default_purchases = {
	republican: new Purchase('republican', 10, 'agent', {
		delay: 1000 / 0.2,
		color: '#A20000',
		size: 15,
		circle: true
	}),
	click_multiplier: new Purchase('click_multiplier', 20, 'upgrade', {
		rate: .10
	}),
	agent: new Purchase('agent', 100, 'agent', {
		name: "i.c.e. agent",
		delay: 1000 / 1,
		color: '#000',
		size: 18,
		circle: true
	}),
	border_agent: new Purchase('border_agent', 1100, 'agent', {
		delay: 1000 / 8,
		color: '#30afe5',
		size: 20,
		max: 2,
		circle: true
	}),
	wall: new Purchase('wall', 13000, 'agent', {
		delay: 1000 / 45,
		color: '#DD8500',
		size: settings.illegal_size + 6,
		max: 6,
		circle: false
	}),
	executive_order: new Purchase('executive_order', 140000, 'agent', {
		delay: 1000 / 260,
		color: '#787878',
		size: 22,
		max: 30,
		circle: false
	}),
	local_law: new Purchase('local_law', 1500000, 'agent', {
		delay: 1000 / 1400,
		color: '#21C800',
		size: 22,
		max: 110,
		circle: false
	}),
	state_law: new Purchase('state_law', 20000000, 'agent', {
		delay: 1000 / 7800,
		color: '#f4d442',
		size: 20,
		max: 400,
		circle: false
	}),
	federal_law: new Purchase('federal_law', 330000000, 'agent', {
		delay: 1000 / 44000,
		color: '#f48341',
		size: 25,
		max: 1000,
		circle: false
	}),
	federal_mandate: new Purchase('federal_mandate', 5100000000, 'agent', {
		delay: 1000 / 260000,
		color: '#41b5f4',
		size: 28,
		max: 5000,
		circle: false
	})
};
var purchases = default_purchases;

/* Set up page */
initShop();
function initShop() {
	for (var key in purchases) {
		var item = purchases[key];
		var details = item.getDetails();
		$("#shop").append(getPurchaseHTML(details));
	}
	setTimeout(updateItemCosts, 500);
}

function getPurchaseHTML(details) {
	return `
		<div class="shop-item" id="` + details.id + `" ontouchstart="attemptBuy(event, '` + details.id + `')" ontouchend="buy(event, '` + details.id + `')">
			<img src="` + details.image + `">
			<div class="desc" id="` + details.id + `-desc">
				<p class="name">` + details.title + `</p>
				<p class="more" id="` + details.id + `-per">` + details.desc + `</p>
				<p class="more">Cost: <span id="` + details.id + `-cost">` + details.cost + `</span></p>
			</div>
			<div class="amount">
				<p id="` + details.id + `-amount">` + details.amount + `</p>
			</div>
		</div>
	`;
}

/* Declare functions */
setInterval(saveData, 5000);
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

function clearData() {
	window.localStorage.clear();
	window.location.reload(true);
}

getData();
function getData() {
	if (window.localStorage.getItem('data')) {
		var data = $.parseJSON(window.localStorage.getItem('data'));
		
		var secondsSinceLast = (Date.now() - data.closed) / 1000;
		var toAdd = (secondsSinceLast * data.total_persecond);
		console.log("Seconds since last: " + secondsSinceLast);
		console.log("Add: " + toAdd);
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

function doesIndexExist(array, object) {
	for (var i = 0; i < array.length; i++) {
		var a = array[i];
		if (a.x == object.x && a.y == object.y) {
			return true;
		}
	}
	return false;
}

function toggleSettings() {
	if (!settingsOpen) {
		$("#settings").show();
	} else {
		$("#settings").hide();
	}
	settingsOpen = !settingsOpen;
}

function resetCount(){
	deported = 0;
	$("#count").html(deported.toFixed(0));
}

updateObscuredItems();
function updateObscuredItems() {
	for (var key in purchases) {
		var item = purchases[key];
		if (deported < item.cost) {
			$("#" + key).css("opacity", "0.3");
		} else {
			$("#" + key).css("opacity", "1");
		}
	}

	if (total_persecond > (settings.click_factor / 10)) {
		var new_rate = total_persecond / settings.click_factor;
		
		purchases.click_multiplier.cost = (new_rate * 95);
		for(var i = 0; i < purchases.click_multiplier.current; i++){
			purchases.click_multiplier.cost += Math.round(purchases.click_multiplier.cost / 20);
		}
		
		purchases.click_multiplier.options.rate = new_rate;
		$("#click_multiplier-per").html(purchases.click_multiplier.getDescription());
		$("#click_multiplier-cost").html(purchases.click_multiplier.getProperCost());
	}
}

function updateItemCosts() {
	for (var key in purchases) {
		var item = purchases[key];
		$("#" + key + "-cost").html(item.getProperCost());
	}
}

function getRewardAmount(){
	return 1000 + (videosWatched * 2000) + (deported / 10);
}

function getProperRewardAmount(){
	return getShortenedNumber(getRewardAmount());
}

function getShortenedNumber(num){
	var dividers = [
		{div: 1000000000000000, ext: "Q"},
		{div: 1000000000000, ext: "T"},
		{div: 1000000000, ext: "B"},
		{div: 1000000, ext: "M"},
		{div: 1000, ext: "K"}
	];
	
	for(var i = 0; i < dividers.length; i++){
		var entry = dividers[i];
		if(num >= entry.div){
			var fixed = (num / entry.div) % 1 == 0 ? (num / entry.div).toFixed(0) : (num / entry.div).toFixed(1);
			return fixed + entry.ext;
		}
	}
	
	return num.toString();
}

function updateNews(string) {
	if (news.length > 5) {
		news.splice(0, 1);
	}
	news.push(string);

	$("#news").html(news.join(" <img src='images/fox.png'> "));
	min_left = -$("#news").width() - 120;
}

// showAlert("Mexico has begun showing signs of aggression against the United States. Is war eminent?");
function showAlert(message){
	$("#alert-message").html(message);
	$("#overlay").show();
	$("#alert").show();
	
	alertShown = Date.now();
}

function exitAlert(){
	if(canExitAlert()){
		$("#overlay").hide();
		$("#alert").hide();
		alertShown = 0;
	}
}

function canExitAlert(){
	return (Date.now() - alertShown > 1000);
}

function isAlertOpen(){
	return (alertShown != 0);
}

function capitalize(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function getNumberWithCommas(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function unroundedRand(min, max) {
	return (Math.random() * (max - min) + min);
}

function distance(pos1, pos2) {
	return Math.sqrt(((pos1.x - pos2.x) * (pos1.x - pos2.x)) + ((pos1.y - pos2.y) * (pos1.y - pos2.y)));
}

function resize() {}