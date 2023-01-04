import React, { useEffect, useRef, useState } from 'react';
import { compressImage, loaderFinished, getProfileData } from '../utils/index';
import { MdCamera, MdCheck, MdDelete, MdEdit, MdMoreVert, MdVerified } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import FileToBase64 from 'dd-file-to-base64';
import './stylesheets/app.css';

import AvatarCropper from './components/AvatarCropper';
import ProfileLoader from './components/ProfileLoader';

function Profile (props) {
	const cookies = new Cookies();

	const [profileData, setProfileData] = useState({}),
		[loading, setLoading] = useState(true),
		[profileMenu, setProfileMenu] = useState(false),
		[editingDescription, setEditingDescription] = useState(false),
		[progress, setProgress] = useState(20),
		[avatarBase64, setAvatarBase64] = useState(''),
		[dialogVisible, setDialogVisible] = useState(false);

	const fileInput = useRef(),
		picturesInput = useRef();

	const history = useHistory();

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

	async function uploadPictures (e) {
		try {
			e.preventDefault()
			setProgress(20)

			const compressedImage = await compressImage(picturesInput.current.files[0]);

			let body = new FormData();

			body.append('pictures', compressedImage)

			const res = await fetch('/api/profile/upload-pictures', {
				method: 'POST',
				body
			});

			const pictures = await res.json();

			setProfileData(profileData => {
				return { ...profileData, pictures }
			})

			setProgress(100)
		} catch (error) {
			console.log(error)
		}
	}

	function deletePicture (e) {
		e.preventDefault()
		e.stopPropagation()

		setProgress(20)

		let pictureId = e.target.key;

		fetch('/api/profile/delete-picture', {
			method: 'POST',
			body: JSON.stringify({
				pictureId
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(pictures => {
			setProfileData(profileData => {
				return { ...profileData, pictures }
			})

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

	useEffect(() => getProfileData(setProfileData, setLoading, setProgress, history), [history])

	if (loading) {
		return(
			<div>
				<ProfileLoader />
			</div>
		);
	}

	return(
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => loaderFinished(setProgress)} />
			<main>
				<div className="profile">
					<div className="avatar">
						<img src={profileData.avatar.url} alt={`${profileData.name}'s avatar`}/>
						<label htmlFor="avatar"><MdCamera color="#ffffff" fontSize="34px" /></label>
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

								setAvatarBase64(base64Image)
								setDialogVisible(true)
							}
						}} />
					<span>
						<h2>
							{profileData.name}
						</h2>
						{profileData.verified ? <span><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
						<span style={{ marginLeft: '1rem' }}  onClick={() => setProfileMenu(!profileMenu)}>
							<MdMoreVert icon="more_vert" size={24} color="#000" />
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
							<MdCheck fontSize="18px" color="#000" />
						</span>
						<span onClick={toggleDescriptionEdit} style={ editingDescription ? { display: 'none' } : { display: 'block' } }>
							<MdEdit fontSize="18px" color="#000" />
						</span>
					</span>
					<form>
						<button>Upload Pictures</button>
						<input type="file" accept="image/*" ref={picturesInput} name="pictures" onChange={event => uploadPictures(event)} />
					</form>
					<div className="pictures">
						{profileData.pictures.length > 0 ? profileData.pictures.map((picture, index) =>
							<figure key={index}>
								<img src={picture.url} key={picture.public_id} alt="Profile photos" />
								<button><MdDelete onClick={deletePicture} color="#ff3b30" fontSize="24px" /></button>
							</figure>
						) : false}
					</div>
				</div>
			</main>
			<AvatarCropper setProgress={setProgress} setProfileData={setProfileData} fileInput={fileInput} avatarBase64={avatarBase64} visible={dialogVisible} setDialogVisible={setDialogVisible} />
		</div>
	);

}

export default Profile;
