import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Tabs () {
	const [tab, setTab] = useState('matches');
	const location = useLocation();

	function setTabByPath () {
		setTab(location.pathname.slice(1))
	}

	useEffect(setTabByPath)

	return (
		<div className="flex flex-row p-5 justify-around">
			<Link className="text-lg sm:text-base" to="/likes" style={ tab === 'likes' ? styledTab : unstyledTab }>
				Likes
			</Link>
			<Link className="text-lg sm:text-base" to="/matches" style={ tab === 'matches' ? styledTab : unstyledTab }>
				Matches
			</Link>
			<Link className="text-lg sm:text-base" to="/dislikes" style={ tab === 'dislikes' ? styledTab : unstyledTab }>
				Dislikes
			</Link>
		</div>
	);
}

const styledTab = {
	color: '#ff005c',
    fontWeight: 'bold',
};

const unstyledTab = {
	color: '#000'
};

export default Tabs;
