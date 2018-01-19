var Purchase = function(id, cost, type, options){
	this.id = id;
	this.current = 0;
	this.cost = cost;
	this.type = type;
	this.options = options;
};

Purchase.prototype.getProperCost = function(){
	return getNumberWithCommas(this.cost);
};

Purchase.prototype.getProperID = function(){
	return this.id.replace("_", " ");
};

Purchase.prototype.getDescription = function(){
	if(this.type == "agent"){
		var per = (1000 / this.options.delay);
		if(per % 1 >= 0.1){
			per = per.toFixed(1);
		}else{
			per = per.toFixed(0);
		}
		return per + " per second";
	}else if(this.type == "upgrade"){
		return "+" + this.options.rate + " per click";
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