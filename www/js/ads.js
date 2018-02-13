var admobid = {
    banner: 'ca-app-pub-3849622190274333/9972053558',
    interstitial: 'ca-app-pub-3849622190274333/4913978629',
    reward_video: 'ca-app-pub-3849622190274333/6461087910'
};
var lastInterstitial = 0;

slideout.on('open', function () {
    setTimeout(function () {
        canBuy = true;
    }, 200);

    try {
        if (canDisplayInterstitial()) {
            admob.interstitial.show();
            lastInterstitial = Date.now();
        }
    } catch (e) {}
});

/*
setTimeout(function () {
    if (showFakeAd) {
        $("#ad").show();
        moveBannerHTML();
        showVideoButton();
    }
}, 1000);
*/

/* Listen for device ready event */
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    setTimeout(function () {
        try {
            /* Set ad configs */
            admob.setOptions({
                publisherId: admobid.banner,
                overlap: true,
                isTesting: false
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
            setTimeout(function () {
                document.addEventListener('admob.interstitial.events.LOAD', onInterstitialLoad);
                admob.interstitial.prepare();
            }, 2000);
            
            showVideoButton();
        } catch (e) {}
    }, 0);
}

/* Fired when the banner loads */
function onBannerLoad() {
    moveBannerHTML();
    admob.banner.show();
    updateItemCosts();
    document.removeEventListener('admob.banner.events.LOAD', onBannerLoad);
}

/* Move elements up when banner is loaded */
function moveBannerHTML() {
    var add = isiPad() ? 90 : 50;
    
    var elements = [
        {id: "count-div", property: "bottom"},
        {id: "shop-img", property: "bottom"},
        {id: "added", property: "bottom"},
        {id: "face-div", property: "bottom", div: 1.9},
        {id: "deporters", property: "marginBottom"}
    ];
    
    for(var i = 0; i < elements.length; i++){
        var elem = elements[i];
        var div = elem.div ? elem.div : 1;
        addToCSS(elem.id, elem.property, add / div);
    }
    
    updateFaceSize();
}

/* Add to an element's css property */
function addToCSS(id, property, add){
    var amount = parseInt($("#" + id).css(property).replace("px", "")) + add;
    $("#" + id).css(property, amount + "px");
}

/* Check if an interstitial ad can be displayed */
function canDisplayInterstitial() {
    return (Date.now() - lastInterstitial > 100000) && Math.random() <= 0.4 && lastInterstitial != 0;
}

/* Fired when the interstitial ad loads */
function onInterstitialLoad() {
    lastInterstitial = 1;

    document.removeEventListener('admob.interstitial.events.LOAD', onInterstitialLoad);
}

/* Listen for interstitial open event */
document.addEventListener('admob.interstitial.events.OPEN', function (event) {
    gamePaused = true;
});

/* Listen for interstitial close event */
document.addEventListener('admob.interstitial.events.CLOSE', function (event) {
    gamePaused = false;
    admob.interstitial.prepare();
});

/* Show the reward video button */
function showVideoButton() {
    if(canWatchVideo() && lastInterstitial > 0){
        $("#reward").show();
        $("#video").css({
            opacity: "1"
        });
    }
}

/* Load and open a reward video */
function watchRewardVideo() {
    if (!loadingVideo) {
        flipIcon("video", true);
        $("#video").css({
            opacity: "0.3"
        });
        loadingVideo = true;
        lastVideo = Date.now();
        admob.rewardvideo.prepare();
    }
}

/* Check if another video can be watched */
function canWatchVideo(){
    return (Date.now() - lastVideo > 900000);
}

/* Listen for reward video open event */
document.addEventListener('admob.rewardvideo.events.OPEN', function (event) {
    gamePaused = true;
});

/* Listen for reward video close event */
document.addEventListener('admob.rewardvideo.events.CLOSE', function (event) {
    gamePaused = false;
});

/* Listen for reward video load event */
document.addEventListener('admob.rewardvideo.events.LOAD', function (event) {
    admob.rewardvideo.show();
    loadingVideo = false;
    setTimeout(function () {
        $("#reward").hide();
    }, 1000);
});

/* Listen for reward video fail to load event */
document.addEventListener('admob.rewardvideo.events.LOAD_FAIL', function (event) {
    $("#reward").hide();
    loadingVideo = false;
});

/* Listen for reward video finish event */
document.addEventListener('admob.rewardvideo.events.REWARD', function (event) {
    setTimeout(function () {
        showAdded(getRewardAmount());
        setCount(deported + getRewardAmount());
        updateObscuredItems();
        videosWatched++;
        updateRewardAmount();
    }, 1000);
});

/* Update the video reward amount */
function updateRewardAmount() {
    $("#vid-reward").html(getProperRewardAmount());
}

/* Get the amount to reward for watching the video */
function getRewardAmount() {
    return 1000 + (videosWatched * 2000) + (total_persecond * 180) + (deported / 12);
}

/* Get the shortened reward amount */
function getProperRewardAmount() {
    return getShortenedNumber(getRewardAmount());
}
