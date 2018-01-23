var default_locs = [{"plus_x":-149.5,"plus_y":-92},{"plus_x":-151.5,"plus_y":-83},{"plus_x":-155.5,"plus_y":-69},{"plus_x":-158.5,"plus_y":-52},{"plus_x":-158.5,"plus_y":-31},{"plus_x":-156.5,"plus_y":-15},{"plus_x":-153.5,"plus_y":2},{"plus_x":-146.5,"plus_y":12},{"plus_x":-137.5,"plus_y":18},{"plus_x":-130.5,"plus_y":7},{"plus_x":-128.5,"plus_y":-15},{"plus_x":-129.5,"plus_y":-38},{"plus_x":-124.5,"plus_y":-60},{"plus_x":-122.5,"plus_y":-73},{"plus_x":-118.5,"plus_y":-94},{"plus_x":-99.5,"plus_y":-92},{"plus_x":-102.5,"plus_y":-74},{"plus_x":-105.5,"plus_y":-52},{"plus_x":-106.5,"plus_y":-32},{"plus_x":-106.5,"plus_y":-11},{"plus_x":-106.5,"plus_y":9},{"plus_x":-106.5,"plus_y":21},{"plus_x":-106.5,"plus_y":34},{"plus_x":-86.5,"plus_y":38},{"plus_x":-78.5,"plus_y":17},{"plus_x":-78.5,"plus_y":0},{"plus_x":-77.5,"plus_y":-22},{"plus_x":-77.5,"plus_y":-43},{"plus_x":-75.5,"plus_y":-64},{"plus_x":-74.5,"plus_y":-72},{"plus_x":-74.5,"plus_y":-85},{"plus_x":-48.5,"plus_y":-85},{"plus_x":-48.5,"plus_y":-68},{"plus_x":-48.5,"plus_y":-49},{"plus_x":-46.5,"plus_y":-35},{"plus_x":-45.5,"plus_y":-13},{"plus_x":-47.5,"plus_y":5},{"plus_x":-47.5,"plus_y":24},{"plus_x":-47.5,"plus_y":45},{"plus_x":-43.5,"plus_y":55},{"plus_x":-26.5,"plus_y":56},{"plus_x":-25.5,"plus_y":32},{"plus_x":-24.5,"plus_y":15},{"plus_x":-23.5,"plus_y":0},{"plus_x":-21.5,"plus_y":-20},{"plus_x":-21.5,"plus_y":-43},{"plus_x":-21.5,"plus_y":-59},{"plus_x":-21.5,"plus_y":-75},{"plus_x":-20.5,"plus_y":-80},{"plus_x":4.5,"plus_y":-81},{"plus_x":4.5,"plus_y":-60},{"plus_x":7.5,"plus_y":-41},{"plus_x":7.5,"plus_y":-19},{"plus_x":6.5,"plus_y":-1},{"plus_x":7.5,"plus_y":18},{"plus_x":7.5,"plus_y":33},{"plus_x":6.5,"plus_y":49},{"plus_x":10.5,"plus_y":62},{"plus_x":27.5,"plus_y":59},{"plus_x":28.5,"plus_y":43},{"plus_x":28.5,"plus_y":24},{"plus_x":30.5,"plus_y":3},{"plus_x":32.5,"plus_y":-17},{"plus_x":33.5,"plus_y":-36},{"plus_x":33.5,"plus_y":-52},{"plus_x":35.5,"plus_y":-68},{"plus_x":48.5,"plus_y":-39},{"plus_x":50.5,"plus_y":-20},{"plus_x":53.5,"plus_y":-2},{"plus_x":53.5,"plus_y":15},{"plus_x":53.5,"plus_y":28},{"plus_x":53.5,"plus_y":44},{"plus_x":79.5,"plus_y":44},{"plus_x":79.5,"plus_y":24},{"plus_x":75.5,"plus_y":10},{"plus_x":75.5,"plus_y":-10},{"plus_x":75.5,"plus_y":-27},{"plus_x":75.5,"plus_y":-51},{"plus_x":98.5,"plus_y":-37},{"plus_x":98.5,"plus_y":-16},{"plus_x":98.5,"plus_y":5},{"plus_x":97.5,"plus_y":27},{"plus_x":99.5,"plus_y":46},{"plus_x":111.5,"plus_y":15},{"plus_x":114.5,"plus_y":-5},{"plus_x":112.5,"plus_y":-26},{"plus_x":112.5,"plus_y":-44},{"plus_x":125.5,"plus_y":-5},{"plus_x":126.5,"plus_y":-55},{"plus_x":136.5,"plus_y":-67}];

var locs = default_locs.slice();

function getRandomLocation(agent){
	var i = rand(0, locs.length - 1);
	var loc = locs[i];
	
	var diff = {x: 5, y: 5};
	if(agent){
		locs.splice(i, 1);
		if(locs.length < 3){
			locs = default_locs.slice();
		}
		
		if(locs.length > 70){
			if(i > 15 && i < locs.length - 15){
				diff.x = 15;
			}
		}
	}else{
		i = rand(0, default_locs.length - 1);
		loc = default_locs[i];
	}
	
	var plus_x = loc.plus_x + rand(-diff.x, diff.x);
	var plus_y = loc.plus_y + rand(-diff.y, diff.y);
	
	return {
		x: (canvas.width / 4) + plus_x,
		y: middle_y + plus_y
	};
}


var default_borders = [{"plus_x":-121.90899658203125,"plus_y":38.02099609375},{"plus_x":-96.5,"plus_y":52},{"plus_x":-65.99500274658203,"plus_y":50.92500305175781},{"plus_x":-53.09100341796875,"plus_y":72.42999267578125},{"plus_x":-26.210006713867188,"plus_y":71.35499572753906},{"plus_x":-58.46800231933594,"plus_y":59.52699279785156}];
var borders = default_borders.slice();

/* Get a random border location */
function getRandomBorder(person){
	if(!borders){
		borders = default_borders.slice();
	}
	
	var i = rand(0, borders.length - 1);
	var loc = borders[i];
	
	if(!person){
		borders.splice(i, 1);
		if(borders.length < 1){
			borders = default_borders.slice();
		}
	}else{
		i = rand(0, default_borders.length - 1);
		loc = default_borders[i];
	}
	
	var plus_x = loc.plus_x + rand(-13, 13);
	var plus_y = loc.plus_y + rand(-5, 5);
	
	return {
		x: (canvas.width / 4) + plus_x,
		y: middle_y + plus_y
	};;
}