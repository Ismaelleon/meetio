import React, { useEffect, useState } from 'react';
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import './stylesheets/app.css';

import InteractionsLoader from './components/InteractionsLoader';
import Tabs from './components/Tabs';

function Likes (props) {
	const [likes, setLikes] = useState([]),
		[loading, setLoading] = useState(true),
		[progress, setProgress] = useState(20);

	const history = useHistory();


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
				setLoading(false)
			} else if (res.status === 204) {
				setLoading(false)
			} else if (res.status === 401) {
				history.push('/')
			}

			setProgress(100)
		})

	}

	useEffect(getLikes, [])

	if (loading) {
		return(
			<div>
				<InteractionsLoader />
			</div>
		);
	}

	return(
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => loaderFinished(setProgress)} />
			<main>
				<Tabs />
				<ul className="list">
					{likes.length > 0 ? likes.map((likedProfile, index) =>
						<li key={index}>
							<Link to={`/user/${likedProfile.name}`}>
								<img src={likedProfile.avatar.url} alt={`${likedProfile.name}'s avatar`} />
								{likedProfile.name}
								{likedProfile.verified ? <span><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
							</Link>
						</li>
					) : <h2>No liked profiles yet</h2>}
				</ul>
			</main>
		</div>
	);
}

export default Likes;