/* Add purchase items to the shop */
initShop();

function initShop() {
    for (var key in purchases) {
        var item = purchases[key];
        var details = item.getDetails();
        if (item.type != "agent") {
            $("#upgrades").append(getPurchaseHTML(details));
        } else {
            $("#deporters").append(getPurchaseHTML(details));
        }
    }
    setTimeout(updateItemCosts, 500);
}

/* Get the shop html for a purchase */
function getPurchaseHTML(details) {
    var html = `
		<div class="shop-item" id="` + details.id + `" ontouchstart="attemptBuy(event, '` + details.id + `')" ontouchend="buy(event, '` + details.id + `')">
			<img id="` + details.id + `-img" src="` + details.image + `">
			<div class="desc" id="` + details.id + `-desc">
				<p class="name">` + details.title + `</p>
				<p class="more" id="` + details.id + `-per">` + details.desc + `</p>
				<p class="more" id="` + details.id + `-cost-div">Cost: <span id="` + details.id + `-cost">` + details.cost + `</span></p>
			</div>
			<div class="amount">
				<p id="` + details.id + `-amount">` + details.amount + `</p>
			</div>
			<div class="about-desc" id="about-desc-` + details.id + `">
				<p>` + details.about + `</p>
			</div>
			<img class="about" id="about-img-` + details.id + `" src="images/about.png" ontouchend="toggleAbout('` + details.id + `')">
		</div>
	`;
    return html;
}

/* Update shop items based on new deport total */
updateObscuredItems();

function updateObscuredItems() {
    for (var key in purchases) {
        var item = purchases[key];
        if (deported < item.cost) {
            if (!item.hidden) {
                showShopItem(item, false);
            }
        } else {
            if (item.hidden) {
                showShopItem(item, true);
            }
        }
    }
}

/* Change a shop item's visibility */
function showShopItem(item, show) {
    if (show && item.cost >= 0) {
        $("#" + item.id).css("opacity", "1");
        $("#about-img-" + item.id).css("opacity", "1");
        item.hidden = false;
    } else {
        $("#" + item.id).css("opacity", "0.3");
        $("#about-img-" + item.id).css("opacity", "0.3");
        item.hidden = true;
    }
}

/* Update shop item costs based on their new amounts */
function updateItemCosts() {
    for (var key in purchases) {
        var item = purchases[key];
        $("#" + key + "-cost").html(item.getProperCost());
        $("#" + key + "-amount").html(item.getProperAmount());
    }

    updateRewardAmount();

    if (total_persecond > (settings.click_factor / 10)) {
        var new_rate = total_persecond / settings.click_factor;

        if (new_rate != purchases.tap_multiplier.options.rate) {
            purchases.tap_multiplier.cost = (new_rate * 95);
            for (var i = 0; i < purchases.tap_multiplier.current; i++) {
                purchases.tap_multiplier.cost += Math.round(purchases.tap_multiplier.cost / 20);
            }

            purchases.tap_multiplier.options.rate = new_rate;
            $("#tap_multiplier-per").html(purchases.tap_multiplier.getDescription());
            $("#tap_multiplier-cost").html(purchases.tap_multiplier.getProperCost());
        }
    }

    purchases.detention_center.cost = getDetentionCenterPrice();
    $("#detention_center-cost").html(purchases.detention_center.getProperCost());

    if (getDetentionCentersPercent() > 1) {
        $("#center-collect").html(getShortenedNumber(getDetentionCentersTotal()));
        $("#center-collect-progress").css({
            width: getDetentionCentersPercent() + "%"
        });
    } else {
        $("#center-collect-div").hide();
    }
}

/* Get the price of the next detention center */
function getDetentionCenterPrice() {
    var index = purchases.detention_center.current;
    var price;
    if (index >= detention_center_prices.length) {
        index = detention_center_prices.length - 1;
        showShopItem(purchases.detention_center, false);
        $("#detention_center-per").html(purchases.detention_center.getDescription());
        $("#detention_center-cost-div").html("");
        price = -1;
    } else {
        price = detention_center_prices[index];
    }
    return price;
}

/* Get the percentage of detention centers full */
function getDetentionCentersPercent() {
    var max_seconds = (purchases.detention_center.current * purchases.detention_center.options.hours) * 3600;
    return max_seconds != 0 ? (detention_centers / max_seconds) * 100 : 0;
}

/* Get the total illegals in the deportation centers */
function getDetentionCentersTotal() {
    return detention_centers * total_persecond;
}

/* Hide the detention centers collect button */
function hideCentersCollectButton() {
    $("#center-collect-div").addClass("disappear");
    setTimeout(function () {
        $("#center-collect-div").hide();
        $("#center-collect-div").removeClass("disappear");
    }, 400);
}

/* Empty the deportation centers and add to the deport total */
function emptyDetentionCenters() {
    deported += getDetentionCentersTotal();
    showAdded(getDetentionCentersTotal());
    detention_centers = 0;
    updateRewardAmount();
    saveData();

    hideCentersCollectButton();
}

var current_about;
/* Expand the about description for the item */
function expandAbout(id) {
    current_about = id;
    $("#about-desc-" + id).show();
    $("#" + id).removeClass("retract");
    $("#" + id).addClass("expand");

    if (taskExists(id)) {
        removeTask(id);
    }
}

/* Close the about description for the item */
function retractAbout(id) {
    current_about = undefined;
    $("#" + id).removeClass("expand");
    $("#" + id).addClass("retract");

    if (taskExists(id)) {
        removeTask(id);
    }

    var task = setTimeout(function () {
        $("#about-desc-" + id).hide();
        $("#" + id).removeClass("retract");
        removeTask(id);
    }, 300);
    tasks.push({
        id: id,
        task: task
    });
}

/* Toggle the about description for the item */
function toggleAbout(id) {
    playSound("open");

    if (current_about && current_about != id) {
        retractAbout(current_about);
    }

    var open = $("#" + id).hasClass("expand") ? true : false;
    if (!open) {
        setTimeout(function () {
            expandAbout(id);
        }, 0);
    } else {
        setTimeout(function () {
            retractAbout(id);
        }, 0);
    }
}

var tasks = [];

/* Flip an icon in the shop */
function flipIcon(id, slow) {
    var elem_class = "flip";
    var delay = 500;
    if (slow) {
        elem_class = "slowflip";
        delay = 5000;
    }

    if (taskExists(id)) {
        $("#" + id + "-img").removeClass(elem_class);
        removeTask(id);
    }

    setTimeout(function () {
        $("#" + id + "-img").addClass(elem_class);
        var task = setTimeout(function () {
            $("#" + id + "-img").removeClass(elem_class);
            removeTask(id);
        }, delay);
        tasks.push({
            id: id,
            task: task
        });
    }, 0);
}

/* Remove and cancel a task from the array */
function removeTask(id) {
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        clearInterval(task.task);
        tasks.splice(i, 1);
    }
}

/* Check if a task exists in the array */
function taskExists(id) {
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        if (task.id == id) {
            return true;
        }
    }
    return false;
}

/* Add a wall to the map */
function addWall() {
    agents.push(new Agent("wall", getRandomBorder("S"), {
        width: 20,
        height: 15
    }));
}


var buyPos = undefined;

/* Set user's initial touch location to prevent accidental purchases */
function attemptBuy(e, id) {
    buyPos = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY
    };
}

/* Buy a shop item */
function buy(e, id) {
    var pos = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY
    };
    var truePos = {
        x: e.changedTouches[0].pageX - $("#" + id).offset().left,
        y: e.changedTouches[0].pageY - $("#" + id).offset().top
    };

    if (!buyPos || distance(buyPos, pos) > 20) {
        return;
    }

    if (distance(truePos, settings.about_loc) < settings.about_dist) {
        toggleAbout(id);
        return;
    }

    var item = purchases[id];
    if (deported >= item.cost && !item.hidden && item.cost >= 0 && canBuy) {
        item.buy();
    } else {
        playSound("error");
    }
}