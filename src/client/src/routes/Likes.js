import React, { useEffect, useState } from 'react';
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';

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

	useEffect(getLikes, [history])

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
					{likes.length > 0 ? likes.map((likedProfile, index) =>
						<li className="px-1 py-2 w-full" key={index}>
							<Link className="flex flex-row items-center text-base sm:text-sm w-auto" to={`/user/${likedProfile.name}`}>
								<img className="w-[60px] h-[60px] rounded-full mr-3" src={likedProfile.avatar.url} alt={`${likedProfile.name}'s avatar`} />
								<p className="hover:underline font-bold">{likedProfile.name}</p>
								{likedProfile.verified ? <span className="ml-3"><MdVerified fontSize="24px" color="rgb(0, 122, 255)" /></span> : <span></span>}
							</Link>
						</li>
					) : <h2 className="text-lg font-bold sm:text-xl">No liked profiles yet</h2>}
				</ul>
			</main>
		</div>
	);
}

export default Likes;
