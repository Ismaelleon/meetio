import React, { useEffect, useState } from 'react';
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';

import InteractionsLoader from './components/InteractionsLoader';
import Tabs from './components/Tabs';

function Dislikes (props) {
	const [dislikes, setDislikes] = useState([]),
		[loading, setLoading] = useState(true),
		[progress, setProgress] = useState(20);

	const history = useHistory();


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
				setLoading(false)
			} else if (res.status === 204) {
				setLoading(false)
			} else if (res.status === 401) {
				history.push('/')
			}

			setProgress(100)
		})

	}

	useEffect(getDislikes, [])

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
			<main className="max-w-lg mx-auto pt-12">
				<Tabs />
				<ul className="flex justify-center p-3">
					{dislikes.length > 0 ? dislikes.map((dislikedProfile, index) =>
						<li key={index}>
							<Link to={`/user/${dislikedProfile.name}`}>
								<img src={dislikedProfile.avatar.url} alt={`${dislikedProfile.name}'s avatar`} />
								{dislikedProfile.name}
								{dislikedProfile.verified ? <span><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
							</Link>
						</li>
					) : <h2 className="text-2xl font-bold sm:text-xl">No disliked profiles yet</h2>}
				</ul>
			</main>
		</div>
	);
}

export default Dislikes;
