var Purchase = function(id, cost, type, options){
	this.id = id;
	this.current = 0;
	this.cost = cost;
	this.type = type;
	this.options = options;
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

Purchase.prototype.getProperID = function(){
	if(this.options.name){
		return this.options.name;
	}else{
		return this.id.replace("_", " ");
	}
};

Purchase.prototype.getDescription = function(){
	if(this.type == "agent"){
		var per = roundNumber(1000 / this.options.delay);
		if(per > settings.shorten_min){
			per = getShortenedNumber(roundNumber(1000 / this.options.delay));
		}
		
		return getNumberWithCommas(per) + " per second";
	}else if(this.type == "upgrade"){
		var per = roundNumber(this.options.rate);
		if(per > settings.shorten_min){
			per = getShortenedNumber(roundNumber(this.options.rate));
		}
		
		return "+" + getNumberWithCommas(per) + " per click";
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