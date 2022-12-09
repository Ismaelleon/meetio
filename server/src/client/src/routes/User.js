import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useLocation } from 'react-router-dom';
import { MdArrowDropDown, MdClear, MdFavorite, MdVerified } from 'react-icons/md';

import ProfileLoader from './components/ProfileLoader';

function User (props) {
	let [user, setUser] = useState({});
	let [dropdownVisible, setDropdownVisible] = useState(false);
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
			setUser(data)
		})
	}

	function tapUser (event) {
		event.stopPropagation()

		let body = {
			name: user.name,
			like: event.currentTarget.classList[0] === 'like'
		};

		body = JSON.stringify(body);

		fetch('/api/home/tap', {
			method: 'POST',
			body: body,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => {
			getUserData()
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
						{user.avatar !== undefined ?
							<img src={`/avatars/${user.avatar}`} alt={`${user.name}'s avatar`} />
							: <></>}
					</div>
					<span>
						<h2>
							{user.name}
						</h2>
						{user.verified ? <span><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
					</span>
		 			<p>{user.description}</p>
					<button onClick={() => setDropdownVisible(!dropdownVisible)}>
						{user.liked ?
							<span>Liked <MdFavorite fontSize="var(--h4)" color="#ff005c" /></span> : 
							<span style={{ color: '#009e5c' }}>Disliked <MdClear fontSize="var(--h4)" color="#099e5c !important" /></span>}
						
						<MdArrowDropDown fontSize="var(--h4)" color="#000" />
					</button>
					<ul style={ dropdownVisible ? { display: 'block' } : { display: 'none' } }>
						<li onClick={tapUser} className="like">Like <MdFavorite fontSize="var(--h4)" color="#ff005c" /></li>
						<li onClick={tapUser} className="dislike">Dislike <MdClear fontSize="var(--h4)" color="#099e5c" /></li>
					</ul>
		 			<div className="pictures">
						{user.pictures !== undefined ? user.pictures.map((picture, index) =>
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
