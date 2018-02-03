/* Shorten a number with letter endings */
function getShortenedNumber(num, longEnding){
	var dividers = [
		{div: 1000000000000000, ext: "Q", longEnd: " quadrillion"},
		{div: 1000000000000, ext: "T", longEnd: " trillion"},
		{div: 1000000000, ext: "B", longEnd: " billion"},
		{div: 1000000, ext: "M", longEnd: " million"},
		{div: 1000, ext: "k", longEnd: " thousand"}
	];
	
	for(var i = 0; i < dividers.length; i++){
		var entry = dividers[i];
		if(num >= entry.div){
			var ending = longEnding ? entry.longEnd : entry.ext;
			
			var fixed = (num / entry.div).toFixed(0);
			if((num / entry.div) % 1 != 0 && (num < 100000 || num >= 1000000)){
				fixed = roundNumber(num / entry.div);
			}
			return (fixed + ending).replace(".0", "");
		}
	}
	
	return num.toFixed(0);
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

/* Display an animate the amount added after starting app */
function showAdded(added) {
	$("#added").html("+" + getShortenedNumber(added));
	$("#added").show();
	
	$("#added").addClass("added-animate");
	setTimeout(function(){
		$("#added").hide();
		$("#added").removeClass("added-animate");
	}, 4000);
}

/* Make an element pop on the screen */
function popElement(element, small){
    var style = "pop-animate";
    if(small){
        style = "pop-animate-small"
    }
    
	$("#" + element).addClass(style);
	setTimeout(function(){
		$("#" + element).removeClass(style);
	}, 1000);
}

/* Open the shop */
function openShop() {
	slideout.open();
	playSound("touch");
}

/* Toggle the settings page */
function toggleSettings(manual) {
	if (!settingsOpen) {
		$("#settings").show();
	} else {
		$("#settings").hide();
	}
	
	if(manual) {
		playSound("touch");
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
	if(total_persecond > settings.shorten_min){
		persecond = getShortenedNumber(total_persecond);
	}else{
		persecond = getNumberWithCommas(roundNumber(total_persecond));
	}
	$("#persecond").html(persecond);
	
	var perclick;
	if(total_perclick > settings.shorten_min){
		perclick = getShortenedNumber(total_perclick);
	}else{
		perclick = getNumberWithCommas(roundNumber(total_perclick));
	}
	$("#perclick").html(perclick);
	
	if($("#pers").width() > 305){
		$("#pers").css({fontSize: "12.5px"});
	}
}

/* Add a new string to the news */
function updateNews(string) {
	if (news.length > 5) {
		news.splice(0, 1);
	}
	news.push(string);

	joinNews();
}

// showAlert("Mexico has begun showing signs of aggression against the United States. Is war eminent?");
/* Show a news alert in the center of the screen */
function showAlert(message){
	$("#alert-message").html(message);
	$("#overlay").show();
	$("#alert").show();
    popElement("alert", true);
	
	alertShown = Date.now();
}

/* Remove the alert from the screen */
function exitAlert(){
	if(canExitAlert()){
		$("#overlay").hide();
		$("#alert").hide();
		alertShown = 0;
        
        if(isEventRunning("illegals_entering")){
            showHealthBar("Beat the illegals!");
        }
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

/* Show the health bar with a title */
function showHealthBar(title){
    $("#health-bar-title").html(title);
    if(clicks > 0){
        setHealthBarPercent((clicks / min_clicks) * 100)
    }else{
        setHealthBarPercent(0);
    }
    $("#health-bar").show();
    popElement("health-bar");
}

/* Set the percent of the health bar */
function setHealthBarPercent(percent){
    $("#health-bar-length").css({width: percent + "%"});
}

/* Add a click to the illegals entering event */
function addSendIllegalClick(){
    var min_clicks = illegals_entering[illegals_entering_index].min_clicks;
    clicks++;
    setHealthBarPercent((clicks / min_clicks) * 100);
    if(clicks > min_clicks){
        endEvent("illegals_entering");
    }
}

/* Send an illegal up from the south */
function sendIllegal(){
    if(typeof Person !== "undefined"){
        people.push(new Person(getRandomSouthLocation(), true));
    }
}

/* Check if a new illegal can be sent north */
function canSendIllegal(){
    if(deported <= 0){
        endEvent("illegals_entering", true);
        deported = 0;
    }
    return Date.now() - last_illegal_enter > illegals_entering_delay && deported > 0;
}

/* Check if an event can be started */
function canStartEvent(event){
    if(event == "illegals_entering"){
        if(illegals_entering_index >= 0 && !isEventRunning("illegals_entering") && total_persecond >= 5){
            return deported >= illegals_entering[illegals_entering_index].min_deported;
        }
    }
}

/* Start an event */
function startEvent(event, dontSave){
    if(event == "illegals_entering"){
        var entry = illegals_entering[illegals_entering_index];
        showAlert(entry.msg);
        last_illegal_enter = Date.now();
        illegals_entering_delay = (0.7 / total_persecond) * 1000;
    }
    if(!dontSave){
        saveData();
    }
}

/* End an event */
function endEvent(event, fail){
    if(event == "illegals_entering"){
        illegals_entering_delay = 0;
        clicks = 0;
        
        illegals_entering_index++;
        if(illegals_entering_index >= illegals_entering.length){
            illegals_entering_index = -1;
        }
        
        $("#health-bar").hide();
        
        if(!fail){
            showAlert("You have sucessfully ended the threat of illegal immigrants entering the country!");
        }else{
            showAlert("You failed to keep the illegals out. Fortunately, President Trump stepped in and finished the job.");
        }
    }
    saveData();
}

/* Check if an event is running */
function isEventRunning(event){
    if(event == "illegals_entering"){
        return illegals_entering_delay > 0;
    }
    return false;
}

var debugMessages = new Array();
var debugId = 1;
/* Add a debug message */
function debug(message){
	$("#debug-div").show();
	
	debugMessages.push(debugId + ": " + message);
	debugId++;
	
	if(debugMessages.length > 6){
		debugMessages.splice(0, 1);
	}
	
	$("#debug").html("");
	for(var i = 0; i < debugMessages.length; i++){
		var msg = debugMessages[i];
		$("#debug").append(msg + "<br>");
	}
}

/*
var colors = [
	"132, 92, 0",
	"139, 69, 19",
	"205, 133, 63",
	"244, 164, 96",
	"160, 82, 45"
];
*/
var colors = [
    "204, 0, 0",
    "0, 98, 204",
    "160, 82, 45",
    "244, 164, 96"
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