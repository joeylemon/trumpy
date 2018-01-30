// http://cookieclicker.wikia.com/wiki/Building
var default_purchases = {
	tap_multiplier: new Purchase('tap_multiplier', 20, 'upgrade', {
		desc: "Allows you to deport more illegals every time you tap the screen.",
		rate: .10
	}),
	detention_center: new Purchase('detention_center', 1000, 'center', {
		desc: "Holds illegal immigrants until it runs out of capacity. Works even when you're not playing.",
		hours: 0.5
	}),
	republican: new Purchase('republican', 10, 'agent', {
		desc: "A trustworthy constituent just trying to do their part.",
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

/* Add purchase items to the shop */
initShop();
function initShop() {
	for (var key in purchases) {
		var item = purchases[key];
		var details = item.getDetails();
		if(item.type != "agent"){
			$("#upgrades").append(getPurchaseHTML(details));
		}else{
			$("#deporters").append(getPurchaseHTML(details));
		}
	}
	setTimeout(updateItemCosts, 500);
}

/* Get the shop html for a purchase */
function getPurchaseHTML(details) {
	return `
		<div style="position: relative;">
			<div class="shop-item" id="` + details.id + `" ontouchstart="attemptBuy(event, '` + details.id + `')" ontouchend="buy(event, '` + details.id + `')">
				<img id="` + details.id + `-img" src="` + details.image + `">
				<div class="desc" id="` + details.id + `-desc">
					<p class="name">` + details.title + `</p>
					<p class="more" id="` + details.id + `-per">` + details.desc + `</p>
					<p class="more">Cost: <span id="` + details.id + `-cost">` + details.cost + `</span></p>
				</div>
				<div class="amount">
					<p id="` + details.id + `-amount">` + details.amount + `</p>
				</div>
				<div class="about-desc" id="about-desc-` + details.id + `">
					<p>` + details.about + `</p>
				</div>
			</div>
			<img class="about" id="about-img-` + details.id + `" src="images/about.png" ontouchend="toggleAbout('` + details.id + `')">
		</div>
	`;
}

/* Update shop items based on new deport total */
updateObscuredItems();
function updateObscuredItems() {
	for (var key in purchases) {
		var item = purchases[key];
		if (deported < item.cost) {
			if(!item.hidden){
				$("#" + key).css("opacity", "0.3");
				$("#about-img-" + key).css("opacity", "0.3");
				item.hidden = true;
			}
		} else {
			if(item.hidden){
				$("#" + key).css("opacity", "1");
				$("#about-img-" + key).css("opacity", "1");
				item.hidden = false;
			}
		}
	}
}

/* Update shop item costs based on their new amounts */
function updateItemCosts() {
	for (var key in purchases) {
		var item = purchases[key];
		$("#" + key + "-cost").html(item.getProperCost());
		$("#" + key + "-amount").html(item.getProperAmount());
	}
	
	if (total_persecond > (settings.click_factor / 10)) {
		var new_rate = total_persecond / settings.click_factor;
		
		if(new_rate != purchases.tap_multiplier.options.rate){
			purchases.tap_multiplier.cost = (new_rate * 95);
			for(var i = 0; i < purchases.tap_multiplier.current; i++){
				purchases.tap_multiplier.cost += Math.round(purchases.tap_multiplier.cost / 20);
			}
			
			purchases.tap_multiplier.options.rate = new_rate;
			$("#tap_multiplier-per").html(purchases.tap_multiplier.getDescription());
			$("#tap_multiplier-cost").html(purchases.tap_multiplier.getProperCost());
		}
	}
	
	var new_cost = 1000 + (total_persecond * 900) + Math.pow(purchases.detention_center.current + 3, 4);
	purchases.detention_center.cost = new_cost;
	$("#detention_center-cost").html(purchases.detention_center.getProperCost());
}

var current_about;
/* Expand the about description for the item */
function expandAbout(id){
	current_about = id;
	$("#about-desc-" + id).show();
	$("#" + id).removeClass("retract");
	$("#" + id).addClass("expand");
}

/* Close the about description for the item */
function retractAbout(id){
	current_about = undefined;
	$("#" + id).removeClass("expand");
	$("#" + id).addClass("retract");
	setTimeout(function(){
		$("#about-desc-" + id).hide();
		$("#" + id).removeClass("retract");
	}, 1000);
}

/* Toggle the about description for the item */
function toggleAbout(id){
	if(current_about && current_about != id){
		retractAbout(current_about);
	}
	
	var open = $("#" + id).hasClass("expand") ? true : false;
	if(!open){
		expandAbout(id);
	}else{
		retractAbout(id);
	}
}

var tasks = [];

/* Flip an icon in the shop */
function flipIcon(id){
	if(taskExists(id)){
		$("#" + id + "-img").removeClass("flip");
		removeTask(id);
	}
	
	setTimeout(function(){
		$("#" + id + "-img").addClass("flip");
		var task = setTimeout(function(){
			$("#" + id + "-img").removeClass("flip");
			removeTask(id);
		}, 500);
		tasks.push({id: id, task: task});
	}, 0);
}

/* Remove and cancel a task from the array */
function removeTask(id){
	for(var i = 0; i < tasks.length; i++){
		var task = tasks[i];
		clearInterval(task.task);
		tasks.splice(i, 1);
	}
}

/* Check if a task exists in the array */
function taskExists(id){
	for(var i = 0; i < tasks.length; i++){
		var task = tasks[i];
		if(task.id == id){
			return true;
		}
	}
	return false;
}

/* Add a wall to the map */
function addWall(){
	agents.push(new Agent("wall", getRandomBorder(), {width: 20, height: 10}));
}


var buyPos = undefined;

/* Set user's initial touch location to prevent accidental purchases */
function attemptBuy(e, id){
	buyPos = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY};
}

/* Buy a shop item */
function buy(e, id){
	var pos = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY};
	if(distance(buyPos, pos) > 20){
		return;
	}
	buyPos = undefined;
	
	var item = purchases[id];
	if(deported >= item.cost){
		item.buy();
	}else{
		playSound("error");
	}
}

/* Update the agents canvas */
function updateAgentCanvas(){
	ctx_agents.clearRect(0, 0, canvas_agents.width, canvas_agents.height);
	for(var i = 0; i < agents.length; i++){
		var agent = agents[i];
		agent.draw();
	}
}