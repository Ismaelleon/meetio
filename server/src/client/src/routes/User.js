import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useLocation } from 'react-router-dom';
import { MdClear, MdFavorite, MdVerified } from 'react-icons/md';

import ProfileLoader from './components/ProfileLoader';

function User (props) {
	let [profileData, setProfileData] = useState({});
	let [loading, setLoading] = useState(true);

	let [progress, setProgress] = useState(20);

	let location = useLocation();

	function getUserData () {
		fetch('/api/user', {
			method: 'POST',
			body: JSON.stringify({
				name: location.pathname.slice(6)
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(data => {
			setProgress(100)
			
			setLoading(false)
			setProfileData(data)
		})
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

	useEffect(getUserData, [])

	if (loading) {
		return(
			<div>
				<ProfileLoader />
			</div>
		);
	}

	return (
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={loaderFinished} />
			<main>
				<div className="profile">
					<div className="avatar">
						{profileData.avatar !== undefined ?
							<img src={`/avatars/${profileData.avatar}`} alt={`${profileData.name}'s avatar`} />
							: <></>}
					</div>
					<span>
						<h2>
							{profileData.name}
						</h2>
						{profileData.verified ? <span><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
					</span>
		 			<p>{profileData.description}</p>
		 			<div className="pictures">
						{profileData.pictures !== undefined ? profileData.pictures.map((picture, index) =>
							<figure key={index}>
								<img src={`/pictures/${picture}`}  alt="Profile photos" />
							</figure>

						) : false}
		 			</div>
				</div>
			</main>
		</div>
	);
}

export default User;
