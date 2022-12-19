import React, { useRef, useEffect, useState } from 'react';
import { loaderFinished, getProfileData } from '../utils/index';
import { useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import MaterialIcon from 'material-icons-react';
import FileToBase64 from 'dd-file-to-base64';
import './stylesheets/form.css';

import AvatarCropper from './components/AvatarCropper';

function SignupDetails () {
	const [avatarBase64, setAvatarBase64] = useState(''),
		[dialogVisible, setDialogVisible] = useState(false),
		[loading, setLoading] = useState(true),
		[profileData, setProfileData] = useState({}),
		[description, setDescription] = useState(''),
		[progress, setProgress] = useState(20);

	const fileInput = useRef(),
		submitButton = useRef();

	const history = useHistory();

	function submitSignUp (event) {
		event.preventDefault();

		let body = JSON.stringify({
			description
		});

		fetch('/api/signup-details', {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => {
			if (res.status === 200) {
				history.push('/home', false)
			}
		})
	}

	function updateForm () {
		if (!loading) {
			if (description.length >= 8) {
				submitButton.current.disabled = false;
			} else {
				submitButton.current.disabled = true;
			}
		}
	}

	useEffect(() => getProfileData(setProfileData, setLoading, setProgress, history), [history])
	useEffect(updateForm, [description, updateForm])

			formData.append('avatar', fileInput.current.files[0])

			fetch('/api/profile/change-avatar', {
				method: 'POST',
				body: formData
			}).then(res => res.json())
			.then(avatar => {
				resolve(false)
			})
			.catch(error => {
				reject(error)
				console.log(error)
			})
		})
	}

	return(
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => loaderFinished(setProgress)} />
			<header className="nav-header">
				<MaterialIcon icon="arrow_back" size={34} />
			</header>
			<main>
				<header>
					<p>Sign Up</p>
				</header>
				<form>
					<div className="avatar">
						<img src="/avatars/avatar.png" alt="avatar" ref={avatarView} />
						<label htmlFor="avatar"><MaterialIcon color="#ffffff" icon="camera_alt" size={34} /></label>
					</div>
					<input type="file"
						id="avatar"
						ref={fileInput}
						accept=".png, .jpg, .jpeg, .gif"
						name="avatar"
						onChange={async event => {
							if (event.target.files.length > 0) {
								let file = event.target.files[0];
								let base64Image = await FileToBase64.convert(file);

								await uploadAvatar()
								setAvatarBase64(base64Image)
								setDialogVisible(true)
							}
						}} />
					<input type="text"
						name="description"
						onChange={event => setDescription(event.target.value)}
						placeholder="A brief description" />
					<button ref={submitButton} onClick={submitSignUp}>Send</button>
				</form>
			</main>
			<AvatarCropper fileInput={fileInput} avatarView={avatarView} avatarBase64={avatarBase64} visible={dialogVisible} hideDialog={hideDialog} setAvatarFileName={setAvatarFileName} />
		</div>
	);
}

export default SignupDetails;
