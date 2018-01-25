var admobid = {
	banner: 'ca-app-pub-3849622190274333/9972053558',
	interstitial: 'ca-app-pub-3849622190274333/4913978629',
	reward_video: 'ca-app-pub-3849622190274333/6461087910'
};
var lastInterstitial = 0;
var shown = false;

/* Listen for device ready event */
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	try {
		admob.setOptions({
			publisherId: admobid.banner,
			overlap: true,
			isTesting: true
		});
		
		/* Load banner ad after five seconds */
		setTimeout(function(){
			admob.banner.config({
				id: admobid.banner,
				autoShow: false
			});
			admob.banner.prepare();
			document.addEventListener('admob.banner.events.LOAD', function(event) {
				moveBannerHTML();
				admob.banner.show();
				
				setTimeout(function(){
					$("#reward").show();
				}, 1000);
			});
		}, 5000);
		
		/* Show interstitial ad on slideout open */
		slideout.on('open', function () {
			if(lastInterstitial == 0){
				admob.interstitial.config({
					id: admobid.interstitial,
					autoShow: false
				});
				admob.interstitial.prepare();
				setTimeout(function(){
					lastInterstitial = 1;
				}, 2000);
			}
			
			if (canDisplayInterstitial()) {
				admob.interstitial.show();
				shown = true;
				lastInterstitial = Date.now();
			}
		});
		
		/* Refresh interstitial ad on slideout close */
		slideout.on('close', function () {
			if (shown) {
				admob.interstitial.config({
					id: admobid.interstitial,
					autoShow: false
				});
				admob.interstitial.prepare();
				
				shown = false;
			}
			
			if (settingsOpen) {
				toggleSettings();
			}
		});
	} catch (e) {}
	
	setTimeout(function(){
		navigator.splashscreen.hide();
	}, 1000);
	getData();
}

/* Move elements up when banner is loaded */
function moveBannerHTML(){
	$("#count-div").css({bottom: "55px"});
	$("#shop-img").css({bottom: "56px"});
	$("#added").css({bottom: "100px"});
}

/* Check if an interstitial ad can be displayed */
function canDisplayInterstitial() {
	return (Date.now() - lastInterstitial > 100000) && Math.random() <= 0.4 && lastInterstitial != 0;
}

/* Load and open a reward video */
function watchRewardVideo() {
	admob.rewardvideo.config({
		id: admobid.reward_video,
		autoShow: true
	});
	admob.rewardvideo.prepare();
	$("#reward").hide();
	$("#video-loading").show();
	setTimeout(function(){
		$("#video-loading").hide();
	}, 7000);
}

/* Listen for reward video load event */
document.addEventListener('admob.rewardvideo.events.LOAD', function(event) {
	$("#video-loading").hide();
});

/* Listen for reward video play event */
document.addEventListener('admob.rewardvideo.events.START', function(event) {
	setTimeout(function(){
		$("#reward").show();
	}, 45000);
});

/* Listen for reward video finish event */
document.addEventListener('admob.rewardvideo.events.REWARD', function(event) {
	showAdded(getRewardAmount());
	deported += getRewardAmount();
	$("#count").html(deported.toFixed(0));
	
	videosWatched++;
	$("#vid-reward").html("+" + getProperRewardAmount());
});

/* Get the amount to reward for watching the video */
function getRewardAmount(){
	return 1000 + (videosWatched * 2000) + (deported / 10);
}

/* Get the shortened reward amount */
function getProperRewardAmount(){
	return getShortenedNumber(getRewardAmount());
}

/* Shorten a number with letter endings */
function getShortenedNumber(num){
	var dividers = [
		{div: 1000000000000000, ext: "Q"},
		{div: 1000000000000, ext: "T"},
		{div: 1000000000, ext: "B"},
		{div: 1000000, ext: "M"},
		{div: 1000, ext: "K"}
	];
	
	for(var i = 0; i < dividers.length; i++){
		var entry = dividers[i];
		if(num >= entry.div){
			var fixed = (num / entry.div) % 1 == 0 ? (num / entry.div).toFixed(0) : (num / entry.div).toFixed(1);
			return (fixed + entry.ext).replace(".0", "");
		}
	}
	
	return num.toFixed(0);
}