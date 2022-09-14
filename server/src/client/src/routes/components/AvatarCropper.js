import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import '../stylesheets/avatar-cropper.css';

function AvatarCropper ({ fileInput, setAvatarFileName, avatarBase64, visible, hideDialog }) {
	const editor = useRef(null);
	const avatarCropperDialog = useRef();
	const [scale, setScale] = useState(1);

	async function cropAvatar () {
		let body = JSON.stringify(await editor.current.getCroppingRect());

		fetch('/api/profile/crop-avatar', {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(({ avatar }) => {
			setAvatarFileName('')
			setAvatarFileName(avatar)
		})
		.catch(error => console.log(error))

		hideDialog()
	}

	return (
		<div className="dialog-container" style={ visible ? visibleStyle : invisibleStyle }>
			<div className="avatar-cropper-dialog" ref={avatarCropperDialog}>
				{visible ?
					<AvatarEditor
						ref={editor}
						image={avatarBase64}
						width={window.innerWidth >= 500 ? 468 : (window.innerWidth / 100) * 72}
						height={window.innerWidth >= 500 ? 468 : (window.innerWidth / 100) * 72}
						border={0}
						scale={scale} />
				: <></>}
				<div className="dialog-controls">
					<label htmlFor="scale">Zoom: </label>
					<input id="scale" type="range" min="1" max="4" step="0.01" onChange={e => setScale(parseInt(e.target.value))} />
				</div>
				<div className="dialog-buttons">
					<button onClick={hideDialog}>Cancel</button>
					<button onClick={cropAvatar}>Upload Avatar</button>
				</div>
			</div>
		</div>
	);
}

const visibleStyle = {
	display: 'flex',
	height: `${window.innerHeight}px`
};

const invisibleStyle = {
	display: 'none'
};

export default AvatarCropper;
