import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import './stylesheets/app.css';

import Tabs from './components/Tabs';

function Dislikes (props) {
	let [dislikes, setDislikes] = useState([]);

	let [progress, setProgress] = useState(20);

	let history = useHistory();


	function getDislikes () {
		fetch('/api/dislikes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(async res => {
			if (res.status === 200) {
				let responseData = await res.json();

				setDislikes(responseData)
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

	useEffect(getDislikes, [])


	return(
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={loaderFinished} />
			<main>
				<Tabs />
				<ul className="list">
					{dislikes.length > 0 ? dislikes.map((dislikedProfile, index) =>
						<li key={index}>
							<img src={`/avatars/${dislikedProfile.avatar}`} alt={`${dislikedProfile.name}'s avatar`} />
							<Link to={`/user/${dislikedProfile.name}`}>
								{dislikedProfile.name}
								{dislikedProfile.verified ? <span><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
							</Link>
						</li>
					) : <h2>No disliked profiles yet</h2>}
				</ul>
			</main>
		</div>
	);
}

export default Dislikes;
