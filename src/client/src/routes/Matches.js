import React, { useEffect, useState } from 'react';
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { MdVerified } from 'react-icons/md';

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

	useEffect(getMatches, [history])

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
				<ul className="flex items-center flex-col p-3">
					{matches.length > 0 ? matches.map((matchedProfile, index) =>
						<li className="px-1 py-2 w-full" key={index}>
							<Link className="flex flex-row items-center text-base sm:text-sm w-auto" to={`/user/${matchedProfile.name}`}>
								<img className="w-[60px] h-[60px] rounded-full mr-3" src={matchedProfile.avatar.url} alt={`${matchedProfile.name}'s avatar`} />
								<p className="hover:underline font-bold">{matchedProfile.name}</p>
								{matchedProfile.verified ? <span className="ml-3"><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
							</Link>
						</li>
					) : <h2 className="text-lg font-bold sm:text-xl">No matches yet</h2>}
				</ul>
			</main>
		</div>
	);
}

export default Matches;
