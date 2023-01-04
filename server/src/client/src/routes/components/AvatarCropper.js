import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { compressImage } from '../../utils/index';
import '../stylesheets/avatar-cropper.css';

function AvatarCropper ({ setProgress, setProfileData, fileInput, avatarBase64, visible, setDialogVisible }) {
	const editor = useRef(null);
	const avatarCropperDialog = useRef();
	const [scale, setScale] = useState(1);

	async function changeAvatar () {
		try {
			setProgress(20)
			setDialogVisible(false)

			let formData = new FormData();

			const crop = await editor.current.getCroppingRect();
			const compressedImage = await compressImage(fileInput.current.files[0]);

			formData.append('crop', JSON.stringify(crop))
			formData.append('avatar', compressedImage)

			const res = await fetch('/api/profile/change-avatar', {
				method: 'POST',
				body: formData,
			});

			const { avatar } = await res.json();

			setProfileData(profileData => {
				return { ...profileData, avatar }
			})

			setProgress(100)
		} catch (error) {
			console.log(error)
		}
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
					<button onClick={() => setDialogVisible(false)}>Cancel</button>
					<button onClick={changeAvatar}>Upload Avatar</button>
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
