import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import './stylesheets/form.css';

function SignupDetails () {
	let [avatar, setAvatar] = useState(''),
		[description, setDescription] = useState('');

	let fileInput = React.createRef(),
		button = React.createRef(),
		avatarView = React.createRef();

	let history = useHistory();


	function submitSignUp (event) {
		event.preventDefault();

		let formData = new FormData();

		formData.append('avatar', fileInput.current.files[0])
		formData.append('description', description)

		fetch('/api/signup-details', {
			method: 'POST',
			body: formData
		}).then(res => {
			if (res.status === 200) {
				history.push('/home', false)
			}
		})
	}


	function updateForm (event) {
		if (avatar !== '') {
			button.current.classList.add('clickable');

			avatarView.current.src = URL.createObjectURL(fileInput.current.files[0])
		} else {
			button.current.classList.remove('clickable');
		}
	}

	useEffect(updateForm, [avatar])

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
						onChange={event => {
							setAvatar(event.target.files[0].name);
						}} />
					<input type="text"
						name="description"
						onChange={event => setDescription(event.target.value)}
						placeholder="A brief description" />
					<button ref={button} onClick={submitSignUp}>Send</button>
				</form>
			</main>
		</div>
	);
}

export default SignupDetails;
