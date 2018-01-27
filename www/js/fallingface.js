var FallingFace = function(){
	this.x = rand(0, (canvas.width / 2) - face.width);
	this.y = rand(-face.height - 10, -face.height);
	this.speed = unroundedRand(2, 3.5);
	this.id = rand(1, 1000000);
	
	var ratio = unroundedRand(0.95, 1.05);
	this.size = {
		width: face.width * ratio,
		height: face.height * ratio
	}
};

FallingFace.prototype.fromData = function(data){
	this.x = data.x;
	this.y = data.y;
	this.speed = data.speed;
	this.id = data.id;
	return this;
};

FallingFace.prototype.draw = function(){
	this.y += this.speed;
	
	ctx_bg.drawImage(face, this.x, this.y, this.size.width, this.size.height);
	
	if(this.y > canvas.height + face.height){
		faces_to_remove.push(this.id);
	}
};