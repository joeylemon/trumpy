var audio = {
	pop: new Howl({src: ["sounds/pop.wav"]}),
	touch: new Howl({src: ["sounds/touch.wav"]}),
	buy: new Howl({src: ["sounds/buy.wav"]}),
	error: new Howl({src: ["sounds/error.wav"]})
};

function playSound(sound){
	audio[sound].seek(0);
	audio[sound].play();
}