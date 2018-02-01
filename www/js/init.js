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
	if(current_about){
		retractAbout(current_about);
	}
});

var size = window.innerHeight * 1.5;
$("#rays").css({width: size + "px", height: size + "px", margin: "-" + (size / 2) + "px 0 0 -" + (size / 2) + "px"});

setTimeout(function(){
	$("body").css({backgroundColor: "#fff"});
	$("#shop-hide").show();
    
    try {
        console.log(admob);
    }catch(ex){
        $("#ad").show();
		moveBannerHTML();
		showVideoButton();
    }
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
			detention_centers: detention_centers,
			closed: Date.now(),
			news: news,
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
		
		detention_centers = data.detention_centers;

		total_persecond = data.total_persecond;
		total_perclick = data.total_perclick;
		updateCounts();
		
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
			
			addToCentersSinceTime(data.closed);
			
			locs = data.locs;
		}, 100);
	}
}

/* Add to the detention centers based on a timestamp */
function addToCentersSinceTime(closed){
	var seconds = (Date.now() - closed) / 1000;
	var max_seconds = (purchases.detention_center.current * purchases.detention_center.options.hours) * 3600;
	
	var new_total = detention_centers + seconds;
    debug("set centers to " + new_total);
	detention_centers = new_total > max_seconds ? max_seconds : new_total;
}

var temp = {closed: 0};
document.addEventListener("pause", paused, false);
document.addEventListener("resume", resumed, false);

/* Detect when the app is moved to the background */
function paused() {
    if(!gamePaused){
        temp.closed = Date.now();
        gamePaused = true;
    }
}

/* Detect when the app is back in the foreground */
function resumed() {
    if(gamePaused){
        addToCentersSinceTime(temp.closed);
        gamePaused = false;
    }
}

/* Toggle the game paused boolean */
function togglePaused() {
	gamePaused = !gamePaused;
}