var Boat = function(){
    this.size = {width: boat.width / settings.boat_ratio, height: boat.height / settings.boat_ratio}
    
    var loc = getRandomCoastLocation();
	this.x = loc.x - (this.size.width / 4);
	this.y = loc.y - (this.size.height / 2);
    this.dest = {x: (canvas.width / 2) - this.size.width, y: rand(this.y - 20, this.y + 20)};
    
	this.speed = 0.4;
	this.id = getNextID();
    this.capacity = 0;
};

Boat.prototype.isFull = function(){
    return this.capacity >= 50;
};

Boat.prototype.getLocation = function(){
    return {x: this.x, y: this.y};
};

Boat.prototype.draw = function(){
    if(this.isFull()){
        var tx = this.dest.x - this.x;
        var ty = this.dest.y - this.y;
        //var degrees = Math.atan2(ty, -tx);
        var dist = Math.sqrt(tx * tx + ty * ty);

        this.x += (tx / dist) * this.speed;
        this.y += (ty / dist) * this.speed;

        var addAlpha = dist < settings.boat_fade_dist;
        var alpha = (dist / settings.boat_fade_dist);

        if(addAlpha){
            ctx.globalAlpha = alpha;
        }
        ctx.drawImage(boat, this.x, this.y, this.size.width, this.size.height);
        if(addAlpha){
            ctx.globalAlpha = 1;
        }

        if(dist < 1){
            boats_to_remove.push(this.id);
        }
    }else{
        ctx.drawImage(boat, this.x, this.y, this.size.width, this.size.height);
    }
};