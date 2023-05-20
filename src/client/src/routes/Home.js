import React, { createRef, useEffect, useState } from 'react'; 
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import { MdClear, MdFavorite, MdVerified, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import './stylesheets/app.css';

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
					<main>
						<div className="person">
							<ul className="pictures" ref={picturesList} style={{gridTemplateColumns: `repeat(${user.pictures.length}, 100%)`}}>
								{user.pictures !== undefined && user.pictures.length > 0 ? user.pictures.map((picture, index) =>
									<li key={index}>
										<img src={picture.url} alt="User face or body." />
									</li>
								) : null}
								{user.pictures !== undefined && user.pictures.length > 0 ?
									<div>
										<span style={currentPicture > 0 ? {opacity: '1'} : {opacity: '0'}} onClick={() => {
											if (currentPicture > 0) {
												picturesList.current.children[currentPicture - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
												setCurrentPicture(currentPicture => currentPicture - 1);
											}
										}}><MdChevronLeft fontSize="24px" /></span>	
										<span style={currentPicture < user.pictures.length - 1 ? {opacity: '1'} : {opacity: '0'}} onClick={e => {
											if (currentPicture < user.pictures.length - 1) {
												picturesList.current.children[currentPicture + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
												setCurrentPicture(currentPicture => currentPicture + 1);
											}
										}}><MdChevronRight fontSize="24px" /></span>	
									</div>
								: null}
							</ul>
							<div className="avatar">
								<img src={user.avatar.url} alt={user.name + '\'s avatar'} width="150px" />
							</div>
							<div>
								<h2><Link to={`/user/${user.name}`}>
										{user.name}
										{user.verified ? <span><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
									</Link></h2>
								<p>{user.description}</p>
							</div>
						</div>
						<div className="buttons">
							<button className="dislike" onClick={e => tapUser(e)}><MdClear fontSize="34px" color="#009e5c" /></button>
							<button className="like" onClick={e => tapUser(e)}><MdFavorite fontSize="34px" color="#ff005c" /></button>
						</div>
					</main>
				:	<main style={{ paddingTop: 'var(--h1)' }}>
						<h2>That's all right now</h2>
					</main>}
		</div>
	);
}

export default Home;
