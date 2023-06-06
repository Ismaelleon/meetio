import React, { useRef, useEffect, useState } from 'react';
import { loaderFinished, getProfileData } from '../utils/index';
import { useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import MaterialIcon from 'material-icons-react';
import FileToBase64 from 'dd-file-to-base64';

import AvatarCropper from './components/AvatarCropper';
import ProfileLoader from './components/ProfileLoader';

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

	if (loading) {
		return(
			<div>
				<header className="nav-header">
				</header>
				<ProfileLoader />
			</div>
		);
	}

	return(
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => loaderFinished(setProgress)} />
			<header className="px-5 py-3">
				<MaterialIcon icon="arrow_back" size={32} />
			</header>
			<main className="flex flex-col items-center">
				<header>
					<p className="text-2xl sm:text-xl font-bold">Sign Up</p>
				</header>
				<form className="flex flex-col w-full p-6 max-w-md">
					<div className="flex flex-col items-center relative my-2">
						<img className="w-[150px] rounded-full" src={profileData.avatar.url} alt="avatar" />
						<label className="absolute bottom-0 ml-24 w-[60px] h-[60px] bg-pink rounded-full flex justify-center items-center" htmlFor="avatar">
							<MaterialIcon color="#ffffff" icon="camera_alt" size={34} />
						</label>
					</div>
					<input type="file"
						className="hidden"
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
					<input type="text"
						className="my-5 p-1 w-full border-b border-black text-lg sm:text-base font-sans"
						name="description"
						onChange={event => setDescription(event.target.value)}
						placeholder="A brief description" />
					<button className="p-2 my-2 border border-neutral-300 min-w-[200px] rounded-2xl text-lg sm:text-base font-medium text-pink disabled:bg-neutral-300 disabled:text-neutral-500 hover:bg-neutral-100" ref={submitButton} onClick={submitSignUp}>Send</button>
				</form>
			</main>
			<AvatarCropper setProgress={setProgress} setProfileData={setProfileData} fileInput={fileInput} avatarBase64={avatarBase64} visible={dialogVisible} setDialogVisible={setDialogVisible} />
		</div>
	);
}

export default SignupDetails;
