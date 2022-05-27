import React, { useEffect, useState } from 'react';
import MaterialIcon from 'material-icons-react';
import LoadingBar from 'react-top-loading-bar';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import './stylesheets/app.css';

import Header from './components/Header';
import NavigationBar from './components/NavigationBar';


function Profile (props) {
	const cookies = new Cookies();

	let [profileData, setProfileData] = useState({});
	let [profileMenu, setProfileMenu] = useState(false);

	let [editingDescription, setEditingDescription] = useState(false);

	let fileInput = React.createRef();
	let picturesInput = React.createRef();

	let [progress, setProgress] = useState(20);

	let history = useHistory();


	function getProfileData () {
		fetch('/api/profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(async res => {
			if (res.status === 200) {
				let data = await res.json();

				setProfileData(data)
			} else {
				history.push('/')
			}

			setProgress(100)
		})
	}


	function updateAvatar () {
		setProgress(20)

		let formData = new FormData();

		formData.append('avatar', fileInput.current.files[0])

		fetch('/api/profile/change-avatar', {
			method: 'POST',
			body: formData
		}).then(res => res.json())
		.then(avatar => {
			let data = profileData;

			data.avatar = avatar;

			setProfileData(data)

			setProgress(100)
		})
	}

	function toggleDescriptionEdit (e) {
		setEditingDescription(!editingDescription)

		if (editingDescription) {
			updateDescription()
		}
	}

	function updateDescription () {
		fetch('/api/profile/change-description', {
			method: 'POST',
			body: JSON.stringify({
				description: profileData.description
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	function uploadPictures (e) {
		e.preventDefault()

		setProgress(20)

		let formData = new FormData(picturesInput.current.parentElement);

		fetch('/api/profile/upload-pictures', {
			method: 'POST',
			body: formData
		}).then(res => res.json())
		.then(pictures => {
			let data = profileData;

			data.pictures = pictures;

			setProfileData(data)

			setProgress(100)
		})
	}

	function deletePicture (e) {
		e.preventDefault()

		setProgress(20)

		let pictureName = e.target.parentElement.previousSibling.src.split('/')[4];

		fetch('/api/profile/delete-picture', {
			method: 'POST',
			body: JSON.stringify({
				pictureName
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(pictures => {
			let data = profileData;

			data.pictures = pictures;

			setProfileData(data)

			setProgress(100)
		})
	}

	function logOut () {
		cookies.remove('token')
		history.push('/')
	}

	function deleteAccount () {
		let password = prompt('Insert your password:');

		if (password !== '' && password !== null) {
			fetch('/api/profile/delete-account', {
				method: 'POST',
				body: JSON.stringify({
					password
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(res => {
				if (res.status === 200) {
					cookies.remove('token')
					history.push('/')
				} else {
					alert('Incorrect password')
				}
			})
		}
	}

	function loaderFinished () {
		let finished = true;

		if (finished) {
			setProgress(0)
		}

		return function cleanup () {
			finished = false;
		}
	}

	useEffect(getProfileData, [])

	 return(
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={loaderFinished} />
			<Header />
			<main>
				<div className="profile">
					<div className="avatar">
						{profileData.avatar !== undefined ?
							<img src={`/avatars/${profileData.avatar}`} alt={`${profileData.name}'s avatar`}/>
							: <></>}
						<label htmlFor="avatar"><MaterialIcon color="#ffffff" icon="camera_alt" size={34} /></label>
					</div>
					<input type="file"
						accept="image/*"
						id="avatar"
						ref={fileInput}
						name="avatar"
						onChange={event => {
							updateAvatar()
						}} />
					<span>
						<h2>
							{profileData.name}
						</h2>
						{profileData.verified ? <span><MaterialIcon icon="verified" size={24} color="rgb(0, 122, 255)" /></span> : <span></span>}
						<span style={{ marginLeft: '1rem' }}  onClick={() => setProfileMenu(!profileMenu)}>
							<MaterialIcon icon="more_vert" size={24} color="#000" />
							<ul style={ profileMenu ? { display: 'block' } : { display: 'none' } }>
								<li onClick={deleteAccount} style={{ color: 'rgb(255, 59, 48)' }}>Delete Account</li>
								<li onClick={logOut}>Log Out</li>
							</ul>
						</span>
					</span>
		 			<span>
						<input type="text" onChange={ e => setProfileData({...profileData, description: e.target.value}) }
		 						style={ editingDescription ? { display: 'block' } : { display: 'none' } } />
						<p style={ editingDescription ? { display: 'none' }  : { display: 'block' }}>
							{profileData.description}
						</p>
		 				<span onClick={toggleDescriptionEdit} style={ editingDescription ? { display: 'block' } : { display: 'none' } }>
		 					<MaterialIcon icon="check" size={18} color="#000" />
		 				</span>
		 				<span onClick={toggleDescriptionEdit} style={ editingDescription ? { display: 'none' } : { display: 'block' } }>
		 					<MaterialIcon icon="edit" size={18} color="#000" />
		 				</span>
		 			</span>
					<form>
						<button>Upload Pictures</button>
						<input type="file" accept="image/*" ref={picturesInput} name="pictures" onChange={event => uploadPictures(event)} multiple />
					</form>
		 			<div className="pictures">
						{profileData.pictures !== undefined ? profileData.pictures.map((picture, index) =>
							<figure key={index}>
								<img src={`/pictures/${picture}`}  alt="Profile photos" />
								<button><MaterialIcon onClick={deletePicture} color="#ff3b30" icon="delete" size={24} /></button>
							</figure>
						) : false}
		 			</div>
				</div>
			</main>
		 	<NavigationBar />
		</div>
	);
}

export default Profile;
