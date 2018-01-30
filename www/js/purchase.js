var Purchase = function(id, cost, type, options){
	this.id = id;
	this.current = 0;
	this.cost = cost;
	this.type = type;
	this.options = options;
	this.hidden = false;
	this.img = new Image();
	
	var img_id = id;
	if(id == "wall"){
		img_id = "wall_long";
	}
	this.img.src = "images/" + img_id + ".png";
};

Purchase.prototype.getProperCost = function(){
	var proper;
	if(this.cost > settings.shorten_min){
		proper = getShortenedNumber(this.cost, true);
	}else{
		proper = getNumberWithCommas(this.cost.toFixed(0))
	}
	return proper;
};

Purchase.prototype.getProperAmount = function(){
	if(this.type != "center"){
		return this.current;
	}else{
		return roundNumber(purchases.detention_center.current * purchases.detention_center.options.hours) + " hrs";
	}
};

Purchase.prototype.getProperID = function(){
	if(this.options.name){
		return this.options.name.toUpperCase();;
	}else{
		return this.id.replace("_", " ").toUpperCase();;
	}
};

Purchase.prototype.getDescription = function(){
	if(this.type == "agent"){
		var per = roundNumber(1000 / this.options.delay);
		if(per > settings.shorten_min){
			per = getShortenedNumber(roundNumber(1000 / this.options.delay));
		}
		
		return "+" + getNumberWithCommas(per) + " per second";
	}else if(this.type == "upgrade"){
		var per = roundNumber(this.options.rate);
		if(per > settings.shorten_min){
			per = getShortenedNumber(roundNumber(this.options.rate));
		}
		
		return "+" + getNumberWithCommas(per) + " per click";
	}else if(this.type == "center"){
		return "+" + this.options.hours + " hours capacity";
	}
};

Purchase.prototype.getDetails = function(){
	return {
			image: "images/" + this.id + ".png",
			id: this.id,
			num_cost: this.cost,
			title: this.getProperID(),
			cost: this.getProperCost(),
			desc: this.getDescription(),
			about: this.options.desc,
			amount: this.current
		};
	/*
	if(this.options.visible){
		return {
			image: "styles/images/" + this.id + ".png",
			title: this.getProperID(),
			cost: this.getProperCost(),
			desc: this.getDescription(),
			amount: this.current
		};
	}else{
		return {
			image: "styles/images/unknown.png",
			title: "unknown",
			cost: "?",
			desc: "? per second",
			amount: ""
		};
	}
	*/
};

Purchase.prototype.buy = function(){
	playSound("buy");
	flipIcon(this.id);
	
	this.current++;
		
	deported -= this.cost;
	document.getElementById("count").innerHTML = deported.toFixed(0);
	
	if(this.type == "agent"){
		total_persecond += (1000 / this.options.delay);
		updateCounts();
		
		if(total_persecond > milestones[0]){
			updateNews("Deportation totals are soaring, reaching a record high of " + milestones[0] + " illegals deported per second.");
			milestones.splice(0, 1);
		}
	}else if(this.type == "upgrade"){
		total_perclick += this.options.rate;
		updateCounts();
	}
	
	$("#" + this.id + "-amount").html(this.getProperAmount());
	
	this.cost += Math.round(this.cost / 6.5);
	updateItemCosts();
	updateObscuredItems();
	
	if(this.id == "wall"){
		addWall();
		
		if(this.current == 1){
			updateNews("After a long wait, Trump finally laying down foundations for the wall between the U.S. and Mexico.");
		}else if(this.current == 4){
			updateNews("Trump rapidly expanding the wall--already stretching hundreds of miles on the border.");
		}else if(this.current == 8){
			updateNews("The wall between the U.S. and Mexico is showing great promise. Immeasurable amounts of illegals being deterred from the U.S. already.");
		}
	}else if(this.type == "agent"){
		agents.push(new Agent(this.id));
		
		if(this.id == "republican" && this.current == 1){
			updateNews("Trump supporters getting involved by helping identify illegal immigrants.");
		}else if(this.id == "agent" && this.current == 1){
			updateNews("President pushing for deportation agents to start doing their jobs--handing out bonuses for agents with the highest deport totals.");
		}else if(this.id == "executive_order" && this.current == 1){
			updateNews("President Donald Trump exhibiting his power as president by passing a new executive order to assist in the war on illegals.");
		}
	}else if(this.type == "center"){
		agents.push(new Agent(this.id, undefined, {width: 15, height: 15}, true));
	}
	
	updateAgentCanvas();
	saveData();
};