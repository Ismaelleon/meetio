import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import FileToBase64 from 'dd-file-to-base64';
import './stylesheets/form.css';

import AvatarCropper from './components/AvatarCropper';

function SignupDetails () {
	let [avatarFileName, setAvatarFileName] = useState(''),
		[avatarBase64, setAvatarBase64] = useState(''),
		[dialogVisible, setDialogVisible] = useState(false),
		[description, setDescription] = useState('');

	let fileInput = React.createRef(),
		button = React.createRef(),
		avatarView = React.createRef();

	let history = useHistory();

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

	function updateForm (event) {
		if (avatarFileName !== '') {
			button.current.classList.add('clickable');

			avatarView.current.src = '';
			avatarView.current.src = `/avatars/${avatarFileName}`;
		} else {
			if (fileInput.current.files.length > 0) {
				avatarView.current.src = URL.createObjectURL(fileInput.current.files[0])
			}
			button.current.classList.remove('clickable');
		}
	}

	function hideDialog () {
		setDialogVisible(false)
	}

	useEffect(updateForm, [avatarFileName])

	function uploadAvatar () {
		let formData = new FormData();

		formData.append('avatar', fileInput.current.files[0])

		fetch('/api/profile/change-avatar', {
			method: 'POST',
			body: formData
		}).then(res => res.json())
		.then(avatar => {
			setAvatarFileName(avatar)
		})
		.catch(error => console.log(error))	

		hideDialog()
	}

	return(
		<div>
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

								uploadAvatar()
								setAvatarBase64(base64Image)
								setDialogVisible(true)
							}
						}} />
					<input type="text"
						name="description"
						onChange={event => setDescription(event.target.value)}
						placeholder="A brief description" />
					<button ref={button} onClick={submitSignUp}>Send</button>
				</form>
			</main>
			<AvatarCropper fileInput={fileInput} avatarView={avatarView} avatarBase64={avatarBase64} visible={dialogVisible} hideDialog={hideDialog} setAvatarFileName={setAvatarFileName} />
		</div>
	);
}

export default SignupDetails;
