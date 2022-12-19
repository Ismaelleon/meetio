import React, { useEffect, useState } from 'react';
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { MdVerified } from 'react-icons/md';
import './stylesheets/app.css';

import InteractionsLoader from './components/InteractionsLoader';
import Tabs from './components/Tabs';

function Matches (props) {
	const [matches, setMatches] = useState([]),
		[loading, setLoading] = useState(true),
		[progress, setProgress] = useState(20);

	const history = useHistory();


	function getMatches () {
		let mounted = true;

		if (mounted) {
			fetch('/api/matches', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(async res => {
				if (res.status === 200) {
					let responseData = await res.json();

					setMatches(responseData)
					setLoading(false)
				} else if (res.status === 204) {
					setLoading(false)	
				} else if (res.status === 401) {
					history.push('/')
				}

				setProgress(100)
				mounted = false;
			})

		}

		return function cleanup () {
			mounted = false;
		}
	}

	useEffect(getMatches, [])

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
					{matches.length > 0 ? matches.map((matchedProfile, index) =>
						<li key={index}>
							<Link to={`/user/${matchedProfile.name}`}>
								<img src={matchedProfile.avatar.url} alt={`${matchedProfile.name}'s avatar`} />
								{matchedProfile.name}
								{matchedProfile.verified ? <span><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
							</Link>
						</li>
					) : <h2>No matches yet</h2>}
				</ul>
			</main>
		</div>
	);
}

export default Matches;
