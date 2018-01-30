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