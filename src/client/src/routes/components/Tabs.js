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
		<div className="tabs">
			<Link to="/likes" style={ tab === 'likes' ? styledTab : unstyledTab }>
				Likes
			</Link>
			<Link to="/matches" style={ tab === 'matches' ? styledTab : unstyledTab }>
				Matches
			</Link>
			<Link to="/dislikes" style={ tab === 'dislikes' ? styledTab : unstyledTab }>
				Dislikes
			</Link>
		</div>
	);
}

const styledTab = {
	color: '#ff005c'
};

const unstyledTab = {
	color: '#000'
};

export default Tabs;
