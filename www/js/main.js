draw();

function draw(){
	var now = Date.now();
	if(now - lastDraw > 15){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx_bg.clearRect(0, 0, canvas.width, canvas.height);
		
		for(var i = 0; i < people.length; i++){
			people[i].draw();
		}
		
		for(var i = 0; i < faces.length; i++){
			faces[i].draw();
		}
		
		for(var i = 0; i < agents.length; i++){
			var agent = agents[i];
			agent.draw();
		}
		
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

function addPerson(start, click){
	if(people.length < settings.max_people){
		people.push(new Person(start));
	}
	
	if(click){
		deported += 1 + (purchases.click_multiplier.current * purchases.click_multiplier.options.rate);
		total++;
	}
	
	document.getElementById("count").innerHTML = deported.toFixed(0);
	updateObscuredItems();
	
	if(faces.length < 50){
		if((total_persecond >= 64 && Math.random() <= 0.9) || total_persecond >= 10 && Math.random() <= 0.5){
			return;
		}
		faces.push(new FallingFace());
	}
}

function addWall(){
	var chunk = rand(1, 5);
	var x, y;
	if(chunk == 1){
		x = rand((canvas.width / 4) - 153.5, (canvas.width / 4) - 138.5);
		y = rand(middle_y + 36, middle_y + 38);
	}else if(chunk == 2){
		x = rand((canvas.width / 4) - 124.5, (canvas.width / 4) - 92.5);
		y = rand(middle_y + 49, middle_y + 58);
	}else if(chunk == 3){
		x = rand((canvas.width / 4) - 107.5, (canvas.width / 4) - 75.5);
		y = rand(middle_y + 56, middle_y + 56);
	}else if(chunk == 4){
		x = rand((canvas.width / 4) - 69.5, (canvas.width / 4) - 39.5);
		y = rand(middle_y + 67, middle_y + 76);
	}else if(chunk == 5){
		x = rand((canvas.width / 4) - 29.5, (canvas.width / 4) - 12.5);
		y = rand(middle_y + 94, middle_y + 103);
	}
	
	agents.push(new Agent("wall", {x: x, y: y}, {width: 25, height: 10}));
}

function addOrder(){
	var x = ((canvas.width / 4) + 103.5) + rand(-20, 20);
	var y = middle_y + rand(-20, 20);
	agents.push(new Agent("executive_order", {x: x, y: y}));
}

var buyPos = undefined;

function attemptBuy(e, id){
	buyPos = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY};
}

function buy(e, id){
	var pos = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY};
	if(distance(buyPos, pos) > 20){
		return;
	}
	buyPos = undefined;
	
	var item = purchases[id];
	if(deported >= item.cost){
		item.current++;
		
		deported -= item.cost;
		document.getElementById("count").innerHTML = deported.toFixed(0);
		
		if(item.type == 'agent'){
			total_persecond += (1000 / item.options.delay);
			document.getElementById("persecond").innerHTML = total_persecond.toFixed(1);
			
			if(total_persecond > milestones[0]){
				updateNews("Deportation totals are soaring, reaching a record high of " + milestones[0] + " illegals deported per second.");
				milestones.splice(0, 1);
			}
		}else if(item.type == 'upgrade'){
			total_perclick += item.options.rate;
			document.getElementById("perclick").innerHTML = total_perclick.toFixed(1);
			
			if(item.current == 1){
				updateNews("Unknown entity is assisting in the war on illegals--large amounts of immigrants exiting the country for no apparent reason.");
			}
		}
		
		document.getElementById(id + "-amount").innerHTML = item.current;
		
		item.cost += Math.round(item.cost / 6.5);
		updateItemCosts();
		updateObscuredItems();
		
		if(id == "wall"){
			addWall();
			
			if(id == "wall" && item.current == 1){
				updateNews("After a long wait, Trump finally laying down foundations for the wall between the U.S. and Mexico.");
			}else if(id == "wall" && item.current == 4){
				updateNews("Trump rapidly expanding the wall--already stretching hundreds of miles on the border.");
			}else if(id == "wall" && item.current == 8){
				updateNews("The wall between the U.S. and Mexico is showing great promise. Immeasurable amounts of illegals being deterred from the U.S. already.");
			}
		}else if(id == "executive_order"){
			addOrder();
			
			if(id == "executive_order" && item.current == 1){
				updateNews("President Donald Trump exhibiting his power as president by passing a new executive order to assist in the war on illegals.");
			}
		}else{
			agents.push(new Agent(id));
			
			if(id == "republican" && item.current == 1){
				updateNews("Trump supporters getting involved by helping identify illegal immigrants.");
			}else if(id == "agent" && item.current == 1){
				updateNews("President pushing for deportation agents to start doing their jobs--handing out bonuses for agents with the highest deport totals.");
			}
		}
	}
}

function getRandomBorder(){
	return borderLocs[rand(0, borderLocs.length - 1)];
}

var click = false;

$(window).bind('touchstart', function(e){
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;
	
	if(distance({x: x, y: y}, {x: window.innerWidth, y: window.innerHeight}) < 75 && !slideout.isOpen()){
		return;
	}
	
	if(!click && !slideout.isOpen()){
		click = true;
		$("#face").css({filter: "brightness(0.8)", width: expanded_face});
	}
});

$(window).bind('touchend', function(e){
	if(click){
		/*
		var x = e.changedTouches[0].pageX;
		var y = e.changedTouches[0].pageY;
		if(x < face.width && y > (canvas.height - face.height)){
			addPerson();
		}
		*/
		addPerson(undefined, true);
		click = false;
		$("#face").css({filter: "brightness(1)", width: face_width});
	}
});

/*
$(window).bind('touchstart', function(e){
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;
	console.log(x + ", " + y);

	var plus_x = (canvas.width / 4) - x;
	var plus_y = middle_y - y;
	console.log("(canvas.width / 4)" + (plus_x > 0 ? " - " : " + ") + Math.abs(plus_x));
	console.log("middle_y" + (plus_y > 0 ? " - " : " + ") + Math.abs(plus_y));
	
	locs.push({
		plus_x: -plus_x,
		plus_y: -plus_y
	});
});
*/