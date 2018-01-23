var admobid = {
	banner: 'ca-app-pub-3849622190274333/9972053558',
	interstitial: 'ca-app-pub-3849622190274333/4913978629',
	reward_video: 'ca-app-pub-3849622190274333/6461087910'
};
var lastInterstitial = 0;
var shown = false;

setTimeout(function(){
	$("#loading-ad").hide();
}, 5000);

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	try {
		admob.setOptions({
			publisherId: admobid.banner,
			overlap: true,
			isTesting: true
		});

		admob.banner.config({
			id: admobid.banner,
			autoShow: true
		});
		admob.banner.prepare();

		admob.interstitial.config({
			id: admobid.interstitial,
			autoShow: false
		});
		admob.interstitial.prepare();
		
		slideout.on('open', function () {
			if (canDisplayInterstitial()) {
				admob.interstitial.show();
				shown = true;
				lastInterstitial = Date.now();
			}
		});
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

		admob.rewardvideo.config({
			id: admobid.reward_video
		});
		admob.rewardvideo.prepare();
	} catch (e) {}
	getData();
}

function canDisplayInterstitial() {
	return (Date.now() - lastInterstitial > 75000) && Math.random() <= 0.4;
}

function watchRewardVideo() {
	admob.rewardvideo.show();
}

document.addEventListener('admob.rewardvideo.events.LOAD', function(event) {
	$("#reward").show();
});

document.addEventListener('admob.rewardvideo.events.START', function(event) {
	$("#reward").hide();
	setTimeout(function(){
		admob.rewardvideo.prepare();
	}, 45000);
});

document.addEventListener('admob.rewardvideo.events.REWARD', function(event) {
	deported += getRewardAmount();
	$("#count").html(deported.toFixed(0));
	
	videosWatched++;
	$("#vid-reward").html("+" + getProperRewardAmount());
});

function getRewardAmount(){
	return 1000 + (videosWatched * 2000) + (deported / 10);
}

function getProperRewardAmount(){
	return getShortenedNumber(getRewardAmount());
}

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
	
	return num.toString();
}