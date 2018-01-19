var FallingFace = function(){
	this.x = rand(0, canvas.width - face.width);
	this.y = rand(-face.height - 10, -face.height);
	this.speed = rand(2, 3.5);
	this.id = rand(1, 10000);
};

FallingFace.prototype.draw = function(){
	this.y += this.speed;
	
	ctx_bg.globalAlpha = 0.7;
	ctx_bg.drawImage(face, this.x, this.y);
	ctx_bg.globalAlpha = 1;
	
	if(this.y > canvas.height + 100){
		for(var i = 0; i < faces.length; i++){
			if(faces[i].id == this.id){
				faces.splice(i, 1);
				break;
			}
		}
	}
};