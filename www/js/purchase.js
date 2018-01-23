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
	return getNumberWithCommas(this.cost.toFixed(0));
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
		var per = (1000 / this.options.delay);
		if(per % 1 >= 0.1){
			per = per.toFixed(1);
		}else{
			per = per.toFixed(0);
		}
		return getNumberWithCommas(per) + " per second";
	}else if(this.type == "upgrade"){
		return "+" + this.options.rate.toFixed(1) + " per click";
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