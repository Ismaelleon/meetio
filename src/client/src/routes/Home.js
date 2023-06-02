import React, { createRef, useEffect, useState } from 'react'; 
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import { MdClear, MdFavorite, MdVerified, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';

import HomeLoader from './components/HomeLoader';

function Home (props) {
	const [user, setUser] = useState({}),
		[loading, setLoading] = useState(true),
		[progress, setProgress] = useState(20),
		[currentPicture, setCurrentPicture] = useState(0);

	const picturesList = createRef();

	const history = useHistory();

	function getUser () {
		fetch('/api/home', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(async res => {
			if (res.status === 200) {
				setProgress(100)

				let userToTap = await res.json();

				setUser(userToTap)
				setLoading(false)
			} else {
				history.push('/')
			}
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
			setUser({})

			getUser()
		})
	}

	useEffect(getUser, [])

	if (loading) {
		return(
			<div>
				<HomeLoader />	
			</div>
		);
	}

	return (
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => loaderFinished(setProgress)} />
				{user.name !== undefined ?
					<main className="max-w-lg mx-auto pt-12">
						<div className="flex flex-col h-screen">
							<ul className="list-none w-full h-1/2 overflow-y-hidden" ref={picturesList}>
								{user.pictures !== undefined && user.pictures.length > 0 ? user.pictures.map((picture, index) =>
									<li className="flex items-center justify-center w-full h-full bg-black" key={index}>
										<img className="w-auto h-full" src={picture.url} alt="User face or body." />
									</li>
								) : null}
								{user.pictures !== undefined && user.pictures.length > 0 ?
									<div>
										<span className="fixed left-0 top-1/4 translate-y-full color-black p-1 bg-neutral-300/50 rounded-full ml-3 z-50 cursor-pointer" style={currentPicture > 0 ? {opacity: '1'} : {opacity: '0'}} onClick={() => {
											if (currentPicture > 0) {
												picturesList.current.children[currentPicture - 1].scrollIntoView({ behavior: 'instant', block: 'nearest' });
												setCurrentPicture(currentPicture => currentPicture - 1);
											}
										}}><MdChevronLeft fontSize="24px" /></span>	
										<span className="fixed right-0 top-1/4 translate-y-full color-black p-1 bg-neutral-300/50 rounded-full mr-3 z-50 cursor-pointer" style={currentPicture < user.pictures.length - 1 ? {opacity: '1'} : {opacity: '0'}} onClick={e => {
											if (currentPicture < user.pictures.length - 1) {
												picturesList.current.children[currentPicture + 1].scrollIntoView({ behavior: 'instant', block: 'nearest' });
												setCurrentPicture(currentPicture => currentPicture + 1);
											}
										}}><MdChevronRight fontSize="24px" /></span>	
									</div>
								: null}
							</ul>
							<div className="-translate-y-1/2 w-[150px] h-[150px] relative p-5">
								<img className="block w-full h-full rounded-full border border-neutral-300" src={user.avatar.url} alt={user.name + '\'s avatar'} width="150px" />
							</div>
							<div className="-translate-y-full p-5">
								<h2 className="text-3xl font-bold sm:text-2xl hover:underline inline-block"><Link className="flex flex-row items-center" to={`/user/${user.name}`}>
										{user.name}
										{user.verified ? <span className="ml-3"><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
									</Link></h2>
								<p className="text-lg sm:text-base">{user.description}</p>
							</div>

							<div className="flex flex-row justify-around -translate-y-full">
								<button className="border border-neutral-300 rounded-full p-5 sm:p-3 hover:bg-neutral-300" onClick={e => tapUser(e)}><MdClear fontSize={window.innerWidth > 384 ? '28px' : '34px'} color="#009e5c" /></button>
								<button className="border border-neutral-300 rounded-full p-5 sm:p-3 hover:bg-neutral-300" onClick={e => tapUser(e)}><MdFavorite fontSize={window.innerWidth > 384 ? '28px' : '34px'} color="#ff005c" /></button>
							</div>
						</div>
					</main>
				:	<main style={{ paddingTop: 'var(--h1)' }}>
						<h2>That's all right now</h2>
					</main>}
		</div>
	);
}

export default Home;
