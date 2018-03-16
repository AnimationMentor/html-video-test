const videoSelector = document.querySelector('#select__video');
const videoElement = document.querySelector('video');
const outputTime = document.querySelector('#output__currentTime');
const outputFrame = document.querySelector('#output__currentFrame');

var frameRate = 24;

function showVideoJson(json) {
	document.querySelector('#text__metadata').value = json;
}


function selectVideo() {
	const selectedVideoId = videoSelector.value;
	videoElement.src = `src/${selectedVideoId}.webm`;

	switch (selectedVideoId) {
	case '6aiu25mm':
		frameRate = 30;
		break;
	case '7m3nrtj3':
		frameRate = 60;
		break;
	case 'uqmg2ec3':
		frameRate = 12;
		break;
	default:
		frameRate = 24;
	}

	document.querySelector('#output__frameRate').value = frameRate;
	document.querySelector('#output__frameDuration').value = (1 / frameRate).toFixed(6);

	fetch(`src/${selectedVideoId}.webm_mse_manifest.json`)
		.then(response => response.text())
		.then(showVideoJson);
}


function showCurrentTime() {
	outputTime.value = videoElement.currentTime;
	outputFrame.value = (videoElement.currentTime * frameRate) + 1;
}


function stopOnSubmit(event) {
	event.preventDefault();
	videoElement.pause();
}


function gotoTime(time) {
	videoElement.currentTime = time;
}


function seekTime(event) {
	stopOnSubmit(event);
	gotoTime(document.querySelector('#input__time').valueAsNumber);
}


function gotoFrame(frame, offset) {
	frame = frame - 1;
	gotoTime((frame / frameRate) + offset);
}


function seekFrame(event) {
	stopOnSubmit(event);
	gotoFrame(document.querySelector('#input__frame').valueAsNumber, 0);
}


function seekFrameTenth(event) {
	stopOnSubmit(event);
	const offset = (1 / frameRate) / 10;
	gotoFrame(document.querySelector('#input__frame--tenth').valueAsNumber, offset);
}


function seekFrameHalf(event) {
	stopOnSubmit(event);
	const offset = (1 / frameRate) / 2;
	gotoFrame(document.querySelector('#input__frame--half').valueAsNumber, offset);
}


videoSelector.addEventListener('change', selectVideo);


// use RAF to sync frame
function syncVideoPosition() {
	showCurrentTime();
	window.requestAnimationFrame(syncVideoPosition);
}
window.requestAnimationFrame(syncVideoPosition);



function stepFrame(event) {
	if (! event.target.matches('button[type="button"]')) {
		return;
	}

	const step = /\+1/.test(event.target.textContent) ? 1 : -1;
	const input = event.target.form.querySelector('input');

	input.value = input.valueAsNumber + step;

	// click first button in form to trigger submit event
	event.target.form.querySelector('button').click();
}


document.addEventListener('click', stepFrame);


function reset() {
	videoElement.pause();
	videoElement.currentTime = 0;

	document.querySelector('#input__time').value = 0;
	document.querySelector('#input__frame').value = 1;
	document.querySelector('#input__frame--tenth').value = 1;
	document.querySelector('#input__frame--half').value = 1;
}
