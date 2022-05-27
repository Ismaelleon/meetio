import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import MaterialIcon from 'material-icons-react';
import './stylesheets/app.css';

import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import Tabs from './components/Tabs';

function Likes (props) {
	let [likes, setLikes] = useState([]);

	let [progress, setProgress] = useState(20);

	let history = useHistory();


	function getLikes () {
		fetch('/api/likes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(async res => {
			if (res.status === 200) {
				let responseData = await res.json();

				setLikes(responseData)
			} else if (res.status === 401) {
				history.push('/')
			}

			setProgress(100)
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

	useEffect(getLikes, [])

	return(
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={loaderFinished} />
			<Header />
			<main>
				<Tabs />
				<ul className="list">
					{likes.length > 0 ? likes.map((likedProfile, index) =>
						<li key={index}>
							<img src={`/avatars/${likedProfile.avatar}`} alt={`${likedProfile.name}'s avatar`} />
							<Link to={`/user/${likedProfile.name}`}>
								{likedProfile.name}
								{likedProfile.verified ? <span><MaterialIcon icon="verified" size={24} color="rgb(0, 122, 255)" /></span> : <span></span>}
							</Link>
						</li>
					) : <h2>No liked profiles yet</h2>}
				</ul>
			</main>
			<NavigationBar />
		</div>
	);
}

export default Likes;
