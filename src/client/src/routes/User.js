import React, { useEffect, useState } from 'react';
import { loaderFinished } from '../utils/index';
import LoadingBar from 'react-top-loading-bar';
import { useLocation } from 'react-router-dom';
import { MdArrowDropDown, MdClear, MdFavorite, MdVerified } from 'react-icons/md';

import ProfileLoader from './components/ProfileLoader';

function User (props) {
	const [user, setUser] = useState({}),
		[dropdownVisible, setDropdownVisible] = useState(false),
		[loading, setLoading] = useState(true),
		[progress, setProgress] = useState(20);

	const location = useLocation();

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
			like: event.currentTarget.id === 'like'
		};

		body = JSON.stringify(body);

		fetch('/api/home/tap', {
			method: 'POST',
			body: body,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(() => {
			setDropdownVisible(false)
			getUserData()
		})
	}

	useEffect(getUserData, [location.pathname])

	if (loading) {
		return(
			<div>
				<ProfileLoader />
			</div>
		);
	}

	return (
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => loaderFinished(setProgress)} />
			<main className="flex justify-center items-center max-w-lg mx-auto pt-12">
				<div className="flex flex-col items-center m-5">
					<div className="w-[150px] h-[150px] m-5 relative">
						{user.avatar !== undefined ?
							<img className="w-full rounded-full" src={user.avatar.url} alt={`${user.name}'s avatar`} />
							: <></>}
					</div>
					<span className="flex flex-row items-center relative">
						<h2 className="text-2xl font-bold sm:text-xl">
							{user.name}
						</h2>
						{user.verified ? <span className="ml-2"><MdVerified fontSize={window.innerWidth > 384 ? '20px' : '24px'} color="rgb(0, 122, 255)" /></span> : <span></span>}
					</span>
		 			<p className="text-base my-2 sm:text-sm">{user.description}</p>
					<button className="flex flex-row justify-center items-center text-base mt-5 mb-2 p-2 rounded-2xl border border-neutral-300 min-w-[200px] font-bold sm:text-sm" onClick={() => setDropdownVisible(!dropdownVisible)}>
						{user.liked ?
							<span className="flex flex-row items-center text-pink">Liked <MdFavorite fontSize="var(--h4)" color="#ff005c" /></span> : 
							<span className="flex flex-row items-center text-green">Disliked <MdClear fontSize="var(--h4)" color="#099e5c !important" /></span>}
						
						<MdArrowDropDown fontSize="var(--h4)" color="#000" />
					</button>
					<ul className="w-[200px] flex flex-col border border-neutral-300 rounded-2xl overflow-hidden" style={ dropdownVisible ? { display: 'block' } : { display: 'none' } }>
						<li id="like" className="text-lg sm:text-base flex flex-row items-center justify-center p-3 hover:bg-neutral-300 cursor-pointer" onClick={tapUser}>Like <MdFavorite fontSize="1rem" color="#ff005c" /></li>
						<li id="dislike" className="text-lg sm:text-base flex flex-row items-center justify-center p-3 hover:bg-neutral-300 cursor-pointer" onClick={tapUser}>Dislike <MdClear fontSize="1rem" color="#099e5c" /></li>
					</ul>
		 			<div className="grid grid-cols-2 mt-5 gap-2">
						{user.pictures !== undefined ? user.pictures.map((picture, index) =>
							<figure key={index}>
								<img src={picture.url}  alt="Profile photos" />
							</figure>

						) : false}
		 			</div>
				</div>
			</main>
		</div>
	);
}

export default User;
