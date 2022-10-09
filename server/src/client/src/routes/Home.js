import React, { useEffect, useState } from 'react'; 
import { Link, useHistory } from 'react-router-dom';
import { MdClear, MdFavorite, MdVerified } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import './stylesheets/app.css';

function Home (props) {
	let [user, setUser] = useState({});

	let history = useHistory();

	let [progress, setProgress] = useState(20);


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

	function loaderFinished () {
		let finished = true;

		if (finished) {
			setProgress(0)
		}

		return function cleanup () {
			finished = false;
		}
	}

	useEffect(getUser, [])

	return (
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={loaderFinished} />
				{user.name !== undefined ?
					<main>
						<div className="person">
							<ul className="pictures">
								{user.pictures !== undefined && user.pictures.length > 0 ? user.pictures.map((picture, index) =>
									<img src={`/pictures/${picture}`} key={index} alt="User face or body." />
								) : <img src={`/avatars/${user.avatar}`} alt="User avatar" />}
							</ul>
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
