var audio = {
	pop: new Audio('sounds/pop.wav'),
	touch: new Audio('sounds/touch.wav'),
	buy: new Audio('sounds/buy.wav'),
	error: new Audio('sounds/error.wav')
};

function playSound(sound){
	audio[sound].currentTime = 0;
	audio[sound].play();
}