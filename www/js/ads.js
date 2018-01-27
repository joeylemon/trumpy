var admobid = {
	banner: 'ca-app-pub-3849622190274333/9972053558',
	interstitial: 'ca-app-pub-3849622190274333/4913978629',
	reward_video: 'ca-app-pub-3849622190274333/6461087910'
};
var lastInterstitial = 0;

/* Listen for device ready event */
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	try {
		/* Set ad configs */
		admob.setOptions({
			publisherId: admobid.banner,
			overlap: true,
			isTesting: true
		});
		admob.banner.config({
			id: admobid.banner,
			autoShow: false
		});
		admob.interstitial.config({
			id: admobid.interstitial,
			autoShow: false
		});
		admob.rewardvideo.config({
			id: admobid.reward_video,
			autoShow: false
		});
		
		/* Load banner ad after five seconds */
		setTimeout(function(){
			admob.banner.prepare();
			document.addEventListener('admob.banner.events.LOAD', onBannerLoad);
		}, 5000);
		
		/* Show interstitial ad on slideout open */
		slideout.on('open', function () {
			if(lastInterstitial == 0){
				admob.interstitial.prepare();
				setTimeout(function(){
					lastInterstitial = 1;
				}, 2000);
			}
			
			if (canDisplayInterstitial()) {
				admob.interstitial.show();
				lastInterstitial = Date.now();
			}
		});
	} catch (e) {}
	
	setTimeout(function(){
		navigator.splashscreen.hide();
	}, 1000);
	getData();
}

/* Fired when the banner loads */
function onBannerLoad(){
	moveBannerHTML();
	admob.banner.show();
	
	setTimeout(function(){
		showVideoButton();
	}, 3000);
	
	document.removeEventListener('admob.banner.events.LOAD', onBannerLoad);
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

/* Listen for interstitial close event */
document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
	admob.interstitial.prepare();
});

/* Show the reward video button */
function showVideoButton() {
	$("#reward").show();
	$("#vid-img").addClass("vid-animate");
	setTimeout(function(){
		$("#vid-img").removeClass("vid-animate");
	}, 1000);
}

/* Load and open a reward video */
function watchRewardVideo() {
	admob.rewardvideo.prepare();
	
	$("#reward").hide();
	$("#video-loading").show();
	setTimeout(function(){
		$("#video-loading").hide();
	}, 7000);
}

/* Listen for reward video load event */
document.addEventListener('admob.rewardvideo.events.LOAD', function(event) {
	admob.rewardvideo.show();
	$("#video-loading").hide();
});

/* Listen for reward video play event */
document.addEventListener('admob.rewardvideo.events.START', function(event) {
	setTimeout(function(){
		showVideoButton();
	}, 80000);
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
	return 1000 + (videosWatched * 2000) + (total_persecond * 120) + (deported / 12);
}

/* Get the shortened reward amount */
function getProperRewardAmount(){
	return getShortenedNumber(getRewardAmount());
}

/* Shorten a number with letter endings */
function getShortenedNumber(num, longEnding){
	var dividers = [
		{div: 1000000000000000, ext: "Q", longEnd: " quadrillion"},
		{div: 1000000000000, ext: "T", longEnd: " trillion"},
		{div: 1000000000, ext: "B", longEnd: " billion"},
		{div: 1000000, ext: "M", longEnd: " million"},
		{div: 1000, ext: "K", longEnd: " thousand"}
	];
	
	for(var i = 0; i < dividers.length; i++){
		var entry = dividers[i];
		if(num >= entry.div){
			var ending = entry.ext;
			if(longEnding){
				ending = entry.longEnd;
			}
			
			var fixed = (num / entry.div) % 1 == 0 ? (num / entry.div).toFixed(0) : (num / entry.div).toFixed(1);
			return (fixed + ending).replace(".0", "");
		}
	}
	
	return num.toFixed(0);
}