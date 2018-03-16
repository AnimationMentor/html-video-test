const videoSelector = document.querySelector('#select__video');
const videoElement = document.querySelector('video');
const outputTime = document.querySelector('#output__currentTime');


function showVideoJson(json) {
	document.querySelector('#text__metadata').value = json;
}


function selectVideo() {
	const selectedVideoId = videoSelector.value;
	videoElement.src = `src/${selectedVideoId}.webm`;

	fetch(`src/${selectedVideoId}.webm_mse_manifest.json`)
		.then(response => response.text())
		.then(showVideoJson);
}


function showCurrentTime() {
	outputTime.textContent = `${videoElement.currentTime.toFixed(6)} seconds`;
}


function seekTime(event) {
	event.preventDefault();
	videoElement.pause();
	videoElement.currentTime = document.querySelector('#input__time').valueAsNumber;
}





videoSelector.addEventListener('change', selectVideo);
videoElement.addEventListener('timeupdate', showCurrentTime);