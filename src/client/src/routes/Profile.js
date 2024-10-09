import React, { useEffect, useRef, useState } from 'react';
import { compressImage, loaderFinished, getProfileData } from '../utils/index';
import { MdCamera, MdCheck, MdDelete, MdEdit, MdMoreVert, MdVerified } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import FileToBase64 from 'dd-file-to-base64';

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

			let body = new FormData();

			for (let picture of picturesInput.current.files) {
				const compressedImage = await compressImage(picture);

				body.append('pictures', compressedImage)
			}

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

		let publicId = e.currentTarget.getAttribute('data-publicid');

		fetch('/api/profile/delete-picture', {
			method: 'POST',
			body: JSON.stringify({
				publicId
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
			<main className="flex justify-center items-center max-w-lg mx-auto pt-12">
				<div className="flex flex-col items-center m-5">
					<div className="w-[150px] h-[150px] m-5 relative">
						<img className="rounded-full" src={profileData.avatar.url} alt={`${profileData.name}'s avatar`}/>
						<label className="absolute bottom-0 right-0 p-3 rounded-full bg-pink" htmlFor="avatar"><MdCamera color="#ffffff" fontSize={window.innerWidth > 384 ? '28px' : '34px'} /></label>
					</div>
					<input className="hidden" type="file"
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
					<span className="flex flex-row items-center relative">
						<h2 className="text-2xl font-bold sm:text-xl">
							{profileData.name}
						</h2>
						{profileData.verified ? <span className="ml-3"><MdVerified fontSize={window.innerWidth > 384 ? '20px' : '24px'} color="rgb(0, 122, 255)" /></span> : <span></span>}
						<span style={{ marginLeft: '1rem' }}  onClick={() => setProfileMenu(!profileMenu)}>
							<MdMoreVert icon="more_vert" size={window.innerWidth > 384 ? 20 : 24} color="#000" />
							<ul className="absolute left-0 w-full my-5 rounded-2xl border border-neutral-300 bg-white overflow-hidden" style={ profileMenu ? { display: 'block' } : { display: 'none' } }>
								<li className="text-base p-3 hover:bg-neutral-300 cursor-pointer sm:text-sm" onClick={deleteAccount} style={{ color: 'rgb(255, 59, 48)' }}>Delete Account</li>
								<li className="text-base p-3 hover:bg-neutral-300 cursor-pointer sm:text-sm" onClick={logOut}>Log Out</li>
							</ul>
						</span>
					</span>
					<span className="flex flex-row items-center">
						<input className="text-base my-2 border border-neutral-300 rounded-md py-1 px-1 sm:text-sm" type="text" onChange={ e => setProfileData({...profileData, description: e.target.value}) }
								style={ editingDescription ? { display: 'block' } : { display: 'none' } } />
						<p className="text-base my-2 sm:text-sm" style={ editingDescription ? { display: 'none' }  : { display: 'block' }}>
							{profileData.description}
						</p>
						<span className="ml-2" onClick={toggleDescriptionEdit} style={ editingDescription ? { display: 'block' } : { display: 'none' } }>
							<MdCheck fontSize={window.innerWidth > 384 ? '16px' : '18px'} color="#000" />
						</span>
						<span className="ml-2" onClick={toggleDescriptionEdit} style={ editingDescription ? { display: 'none' } : { display: 'block' } }>
							<MdEdit fontSize={window.innerWidth > 384 ? '16px' : '18px'} color="#000" />
						</span>
					</span>
					<form>
						<label for="pictures" className="flex justify-center text-base mt-5 mb-2 text-pink p-2 rounded-2xl border border-neutral-300 min-w-[200px] font-bold sm:text-sm cursor-pointer hover:bg-neutral-300">Upload Pictures</label>
						<input className="hidden" id="pictures" type="file" accept="image/*" ref={picturesInput} name="pictures" onChange={event => uploadPictures(event)} multiple />
					</form>
					<div className="grid grid-cols-2 mt-5 gap-2">
						{profileData.pictures.length > 0 ? profileData.pictures.map((picture, index) =>
							<figure className="relative" key={index}>
								<img src={picture.url} key={picture.public_id} alt="Profile photos" />
								<button className="absolute top-1 right-1" onClick={deletePicture} data-publicid={picture.public_id}><MdDelete color="#ff3b30" fontSize="24px" /></button>
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
