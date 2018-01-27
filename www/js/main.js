draw();

/* Draw the game */
function draw(){
	if(!gamePaused){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
		
		clearPeople();
		clearFaces();
		
		for(var i = 0; i < faces.length; i++){
			faces[i].draw();
		}
		
		for(var i = 0; i < agents.length; i++){
			var agent = agents[i];
			agent.deport();
		}
		
		for(var i = 0; i < people.length; i++){
			people[i].draw();
		}
		
		news_left -= 0.5;
		if(news_left < min_left){
			news_left = $(window).width();
		}
		$("#news").css({left: news_left});
	}
	window.requestAnimationFrame(draw);
}

/* Clear old people from the array */
function clearPeople(){
	for(var x = 0; x < people_to_remove.length; x++){
		var remove_id = people_to_remove[x];
		for(var i = 0; i < people.length; i++){
			if(people[i].id == remove_id){
				people.splice(i, 1);
				break;
			}
		}
	}
	people_to_remove = new Array();
}

/* Clear old faces from the array */
function clearFaces(){
	for(var x = 0; x < faces_to_remove.length; x++){
		var remove_id = faces_to_remove[x];
		for(var i = 0; i < faces.length; i++){
			if(faces[i].id == remove_id){
				faces.splice(i, 1);
				break;
			}
		}
	}
	faces_to_remove = new Array();
}

/* Add a person to the map */
function addPerson(start, click){
	people.push(new Person(start));
	
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
var touchpos;

/* Listen for the touch start to begin adding a person */
$(window).bind('touchstart', function(e){
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;
	
	if(distance({x: x, y: y}, {x: window.innerWidth, y: window.innerHeight - 50}) < 75 && !slideout.isOpen()){
		return;
	}
	
	if(!click && !slideout.isOpen() && !isAlertOpen()){
		click = true;
		touchpos = {x: x, y: y};
		$("#face").css({filter: "brightness(0.8)", width: expanded_face});
		$("#face-div").css({bottom: "103px"});
	}
});

/* Listen for the touch end to add the person */
$(window).bind('touchend', function(e){
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;
	
	if(click){
		if(distance(touchpos, {x: x, y: y}) < 30){
			addPerson(undefined, true);
			playSound("pop");
		}
		$("#face").css({filter: "brightness(1)", width: face_width});
		$("#face-div").css({bottom: face_bottom});
		click = false;
	}
});

var last_deported = deported;
setInterval(function(){
	$("#true-persecond").html((deported - last_deported).toFixed(1));
	last_deported = deported;
}, 1000);

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