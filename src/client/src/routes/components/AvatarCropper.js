import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { compressImage } from '../../utils/index';

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
		<div className="fixed flex justify-center items-center top-0 left-0 w-screen h-screen bg-neutral-500/20" style={ visible ? visibleStyle : invisibleStyle }>
			<div className="bg-white p-6 rounded" ref={avatarCropperDialog}>
				{visible ?
					<AvatarEditor
						ref={editor}
						image={avatarBase64}
						width={window.innerWidth >= 500 ? 468 : (window.innerWidth / 100) * 72}
						height={window.innerWidth >= 500 ? 468 : (window.innerWidth / 100) * 72}
						border={0}
						scale={scale} />
				: <></>}
				<div className="flex flex-row justify-around items-center my-4">
					<label className="text-base" htmlFor="scale">Zoom: </label>
					<input id="scale" type="range" min="1" max="4" step="0.01" onChange={e => setScale(parseInt(e.target.value))} />
				</div>
				<div className="grid grid-cols-2 gap-2">
					<button className="p-2 border border-neutral-300 rounded-2xl text-base sm:text-base font-medium text-pink disabled:bg-neutral-300 disabled:text-neutral-500 hover:bg-neutral-100" onClick={() => setDialogVisible(false)}>Cancel</button>
					<button className="p-2 border border-neutral-300 rounded-2xl text-base sm:text-base font-medium text-pink disabled:bg-neutral-300 disabled:text-neutral-500 hover:bg-neutral-100" onClick={changeAvatar}>Upload Avatar</button>
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
