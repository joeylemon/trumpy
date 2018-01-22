draw();

/* Draw the game */
function draw(){
	var now = Date.now();
	if(now - lastDraw > 15){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx_bg.clearRect(0, 0, canvas.width, canvas.height);
		
		for(var i = 0; i < faces.length; i++){
			faces[i].draw();
		}
		
		for(var i = 0; i < people.length; i++){
			people[i].draw();
		}
		
		ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
		for(var i = 0; i < agents.length; i++){
			var agent = agents[i];
			agent.draw();
		}
		ctx.shadowColor = "transparent";
		
		/*
		for(var i = 0; i < locs.length; i++){
			var loc = locs[i];
			
			var x = (canvas.width / 4) + loc.plus_x;
			var y = middle_y + loc.plus_y;
			
			ctx.beginPath();
			ctx.arc(x, y, 6, 0, 2 * Math.PI);
			ctx.fill();
		}
		*/
		
		news_left -= 0.5;
		if(news_left < min_left){
			news_left = $(window).width();
		}
		$("#news").css({left: news_left});
		
		lastDraw = now;
	}
	window.requestAnimationFrame(draw);
}

/* Add a person to the map */
function addPerson(start, click){
	if(people.length < settings.max_people){
		people.push(new Person(start));
	}
	
	if(click){
		deported += 1 + total_perclick;
		total++;
	}
	
	document.getElementById("count").innerHTML = deported.toFixed(0);
	updateObscuredItems();
	
	if(faces.length < settings.max_faces){
		faces.push(new FallingFace());
	}
}

var click = false;

/* Listen for the touch start to begin adding a person */
$(window).bind('touchstart', function(e){
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;
	
	if(distance({x: x, y: y}, {x: window.innerWidth, y: window.innerHeight - 50}) < 75 && !slideout.isOpen()){
		return;
	}
	
	if(!click && !slideout.isOpen() && !isAlertOpen()){
		click = true;
		$("#face").css({filter: "brightness(0.8)", width: expanded_face});
	}
});

/* Listen for the touch end to add the person */
$(window).bind('touchend', function(e){
	if(click){
		addPerson(undefined, true);
		click = false;
		$("#face").css({filter: "brightness(1)", width: face_width});
	}
});

/*
var temp_locs = new Array();
$(window).bind('touchstart', function(e){
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;
	console.log(x + ", " + y);

	var plus_x = (canvas.width / 4) - x;
	var plus_y = middle_y - y;
	console.log("(canvas.width / 4)" + (plus_x > 0 ? " - " : " + ") + Math.abs(plus_x));
	console.log("middle_y" + (plus_y > 0 ? " - " : " + ") + Math.abs(plus_y));
	
	temp_locs.push({
		plus_x: -plus_x,
		plus_y: -plus_y
	});
});
*/