const Compressor = require('compressorjs');

function loaderFinished (setProgress) {
	let finished = true;

	if (finished) {
		setProgress(0)
	}

	return function cleanup () {
		finished = false;
	}
}

function getProfileData (setProfileData, setLoading, setProgress, history) {
	fetch('/api/profile', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(async res => {
		if (res.status === 200) {
			let data = await res.json();

			setProfileData(data)
			setLoading(false)
		} else {
			history.push('/')
		}

		setProgress(100)
	})
}

function compressImage (image) {
	return new Promise((resolve, reject) => {
		new Compressor(image, {
			quality: 0.5,
			width: 256,
			success: (compressedImage) => {
				resolve(compressedImage)
			},
			error: (err) => {
				reject(err)
			}
		})
	})
}

module.exports = {
	loaderFinished,
	getProfileData,
	compressImage
};
