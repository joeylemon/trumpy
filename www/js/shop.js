// http://cookieclicker.wikia.com/wiki/Building
var default_purchases = {
	republican: new Purchase('republican', 10, 'agent', {
		delay: 1000 / 0.2,
		size: 15
	}),
	click_multiplier: new Purchase('click_multiplier', 20, 'upgrade', {
		rate: .10
	}),
	ice_agent: new Purchase('ice_agent', 100, 'agent', {
		delay: 1000 / 1,
		size: 18
	}),
	border_agent: new Purchase('border_agent', 1100, 'agent', {
		delay: 1000 / 8,
		size: 20,
		max: 2
	}),
	wall: new Purchase('wall', 13000, 'agent', {
		delay: 1000 / 45,
		size: 9,
		max: 6
	}),
	executive_order: new Purchase('executive_order', 140000, 'agent', {
		delay: 1000 / 260,
		size: 22,
		max: 30
	}),
	local_law: new Purchase('local_law', 1500000, 'agent', {
		delay: 1000 / 1400,
		size: 22,
		max: 100
	}),
	state_law: new Purchase('state_law', 20000000, 'agent', {
		delay: 1000 / 7800,
		size: 20,
		max: 400
	}),
	federal_law: new Purchase('federal_law', 330000000, 'agent', {
		delay: 1000 / 44000,
		size: 25,
		max: 3000
	}),
	federal_mandate: new Purchase('federal_mandate', 5100000000, 'agent', {
		delay: 1000 / 260000,
		size: 28,
		max: 10000
	}),
	martial_law: new Purchase('martial_law', 75000000000, 'agent', {
		delay: 1000 / 1600000,
		size: 28,
		max: 70000
	}),
	national_guard: new Purchase('national_guard', 1000000000000, 'agent', {
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
		$("#shop").append(getPurchaseHTML(details));
	}
	setTimeout(updateItemCosts, 500);
}

/* Get the shop html for a purchase */
function getPurchaseHTML(details) {
	return `
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
				item.hidden = true;
			}
		} else {
			if(item.hidden){
				$("#" + key).css("opacity", "1");
				item.hidden = false;
			}
		}
	}

	if (total_persecond > (settings.click_factor / 10)) {
		var new_rate = total_persecond / settings.click_factor;
		
		if(new_rate != purchases.click_multiplier.options.rate){
			console.log("change");
			
			purchases.click_multiplier.cost = (new_rate * 95);
			for(var i = 0; i < purchases.click_multiplier.current; i++){
				purchases.click_multiplier.cost += Math.round(purchases.click_multiplier.cost / 20);
			}
			
			purchases.click_multiplier.options.rate = new_rate;
			$("#click_multiplier-per").html(purchases.click_multiplier.getDescription());
			$("#click_multiplier-cost").html(purchases.click_multiplier.getProperCost());
		}
	}
}

/* Update shop item costs based on their new amounts */
function updateItemCosts() {
	for (var key in purchases) {
		var item = purchases[key];
		$("#" + key + "-cost").html(item.getProperCost());
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
		flipIcon(id);
		
		if(id == "click_multiplier"){
			/* Seperate buy function, otherwise deport total becomes NaN? */
			item.current++;
			
			deported -= item.cost;
			document.getElementById("count").innerHTML = deported.toFixed(0);
			
			total_perclick += item.options.rate;
			updateCounts();
			
			if(item.current == 1){
				updateNews("Unknown entity is assisting in the war on illegals &mdash; large amounts of immigrants exiting the country for no apparent reason.");
			}
			
			document.getElementById(id + "-amount").innerHTML = item.current;
			
			item.cost += Math.round(item.cost / 6.5);
			updateItemCosts();
			updateObscuredItems();
			
			updateAgentCanvas();
			saveData();
			
			return;
		}
		
		item.current++;
		
		deported -= item.cost;
		document.getElementById("count").innerHTML = deported.toFixed(0);
		
		if(item.type == 'agent'){
			total_persecond += (1000 / item.options.delay);
			updateCounts();
			
			if(total_persecond > milestones[0]){
				updateNews("Deportation totals are soaring, reaching a record high of " + milestones[0] + " illegals deported per second.");
				milestones.splice(0, 1);
			}
		}
		
		document.getElementById(id + "-amount").innerHTML = item.current;
		
		item.cost += Math.round(item.cost / 6.5);
		updateItemCosts();
		updateObscuredItems();
		
		if(id == "wall"){
			addWall();
			
			if(item.current == 1){
				updateNews("After a long wait, Trump finally laying down foundations for the wall between the U.S. and Mexico.");
			}else if(item.current == 4){
				updateNews("Trump rapidly expanding the wall--already stretching hundreds of miles on the border.");
			}else if(item.current == 8){
				updateNews("The wall between the U.S. and Mexico is showing great promise. Immeasurable amounts of illegals being deterred from the U.S. already.");
			}
		}else{
			agents.push(new Agent(id));
			
			if(id == "republican" && item.current == 1){
				updateNews("Trump supporters getting involved by helping identify illegal immigrants.");
			}else if(id == "agent" && item.current == 1){
				updateNews("President pushing for deportation agents to start doing their jobs--handing out bonuses for agents with the highest deport totals.");
			}else if(id == "executive_order" && item.current == 1){
				updateNews("President Donald Trump exhibiting his power as president by passing a new executive order to assist in the war on illegals.");
			}
		}
		
		updateAgentCanvas();
		saveData();
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