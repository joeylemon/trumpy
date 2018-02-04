var admobid = {
	banner: 'ca-app-pub-3849622190274333/9972053558',
	interstitial: 'ca-app-pub-3849622190274333/4913978629',
	reward_video: 'ca-app-pub-3849622190274333/6461087910'
};
var lastInterstitial = 0;

/* Listen for device ready event */
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	setTimeout(function(){
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
            
            showFakeAd = false;
			
			/* Load banner ad */
			document.addEventListener('admob.banner.events.LOAD', onBannerLoad);
			admob.banner.prepare();
			
			/* Load interstitial ad */
			setTimeout(function(){
				document.addEventListener('admob.interstitial.events.LOAD', onInterstitialLoad);
				admob.interstitial.prepare();
			}, 2000);
			
			/* Show interstitial ad on slideout open */
			slideout.on('open', function () {
				if (canDisplayInterstitial()) {
					admob.interstitial.show();
					lastInterstitial = Date.now();
				}
			});
		} catch (e) {}
	}, 0);
	
	setTimeout(function(){
		navigator.splashscreen.hide();
	}, 1000);
}

/* Fired when the banner loads */
function onBannerLoad(){
	moveBannerHTML();
	admob.banner.show();
	updateItemCosts();
	
	showVideoButton();
	
	document.removeEventListener('admob.banner.events.LOAD', onBannerLoad);
}

/* Move elements up when banner is loaded */
function moveBannerHTML(){
	$("#count-div").css({bottom: "55px"});
	$("#shop-img").css({bottom: "56px"});
	$("#added").css({bottom: "100px"});
	$("#deporters").css({marginBottom: "50px"});
}

/* Check if an interstitial ad can be displayed */
function canDisplayInterstitial() {
	return (Date.now() - lastInterstitial > 100000) && Math.random() <= 0.4 && lastInterstitial != 0;
}

/* Fired when the interstitial ad loads */
function onInterstitialLoad(){
	lastInterstitial = 1;
	
	document.removeEventListener('admob.interstitial.events.LOAD', onInterstitialLoad);
}

/* Listen for interstitial close event */
document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
	admob.interstitial.prepare();
});

/* Show the reward video button */
function showVideoButton() {
	$("#reward").show();
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

/* Listen for reward video fail to load event */
document.addEventListener('admob.rewardvideo.events.LOAD_FAIL', function(event) {
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
	setTimeout(function(){
		showAdded(getRewardAmount());
		deported += getRewardAmount();
		$("#count").html(deported.toFixed(0));
	}, 1000);
	
	videosWatched++;
	updateRewardAmount();
});

/* Update the video reward amount */
function updateRewardAmount(){
    $("#vid-reward").html(getProperRewardAmount());
}

/* Get the amount to reward for watching the video */
function getRewardAmount(){
	return 1000 + (videosWatched * 2000) + (total_persecond * 120) + (deported / 12);
}

/* Get the shortened reward amount */
function getProperRewardAmount(){
	return getShortenedNumber(getRewardAmount());
}