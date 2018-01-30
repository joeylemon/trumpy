/* Shorten a number with letter endings */
function getShortenedNumber(num, longEnding){
	var dividers = [
		{div: 1000000000000000, ext: "Q", longEnd: " quadrillion"},
		{div: 1000000000000, ext: "T", longEnd: " trillion"},
		{div: 1000000000, ext: "B", longEnd: " billion"},
		{div: 1000000, ext: "M", longEnd: " million"},
		{div: 1000, ext: "K", longEnd: " thousand"}
	];
	
	for(var i = 0; i < dividers.length; i++){
		var entry = dividers[i];
		if(num >= entry.div){
			var ending = longEnding ? entry.longEnd : entry.ext;
			
			var fixed = (num / entry.div).toFixed(0);
			if((num / entry.div) % 1 != 0 && num < 100000){
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
function popElement(element){
	$("#" + element).addClass("pop-animate");
	setTimeout(function(){
		$("#" + element).removeClass("pop-animate");
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